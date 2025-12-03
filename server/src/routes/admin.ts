import { Router, Request, Response, NextFunction } from 'express'
import { getStats } from '../controllers/adminController'
import { requireAdmin } from '../middleware/requireAdmin'
import { PrismaClient } from '@prisma/client'
import { validate } from '../middleware/validate'
import { reviewClaimSchema } from '../validation/claimSchemas'
import * as ClaimController from '../controllers/ClaimController'
import { SyncService } from '../services/SyncService'
import { Cache } from '../lib/cache'

const router = Router()
const prisma = new PrismaClient()

router.get('/stats', requireAdmin, getStats)

// Get all reviews with optional status filter
router.get('/reviews', requireAdmin, async (req, res) => {
  const status = req.query.status as string | undefined;
  const reviews = await prisma.review.findMany({
    where: status ? { status: status as any } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      university: { select: { name: true } },
      user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } }
    },
    take: 50
  })
  res.json({ data: reviews })
})

// --- UNIVERSITY CLAIMS ADMIN ROUTES ---

// GET /api/admin/claims - Get all claims (pending first)
router.get('/claims', requireAdmin, ClaimController.getAllClaims);

// PATCH /api/admin/claims/:id/review - Review a specific claim
router.patch('/claims/:id/review', 
  requireAdmin, 
  validate(reviewClaimSchema), 
  ClaimController.reviewClaim
);

// --- NEW SYSTEM INTEGRITY & POWER TOOLS ROUTES ---

// GET /api/admin/health/cache - Get cache performance status
router.get('/health/cache', requireAdmin, async (req: Request, res: Response) => {
    try {
        const stats = (Cache as any).getStats();
        res.status(200).json({ status: 'success', data: stats });
    } catch (err) {
        // Return 500 if cache is not ready
        res.status(500).json({ status: 'error', message: 'Cache service unavailable.' });
    }
});

// POST /api/admin/health/cache/clear - Clear the cache
router.post('/health/cache/clear', requireAdmin, (req: Request, res: Response) => {
    try {
        Cache.clear();
        res.status(200).json({ status: 'success', message: 'In-memory cache cleared.' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to clear cache.' });
    }
});

// GET /api/admin/health/sync-status - Check Clerk/Neon data consistency
router.get('/health/sync-status', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const status = await SyncService.verifySyncStatus();
        res.status(200).json({ status: 'success', data: status });
    } catch (err) {
        next(err);
    }
});

// POST /api/admin/health/reconcile - Trigger Clerk -> Neon reconciliation
router.post('/health/reconcile', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await SyncService.reconcileClerkToNeon();
        res.status(200).json({ status: 'success', message: 'Reconciliation process initiated.', data: result });
    } catch (err) {
        next(err);
    }
});

// --- LEGACY ROUTES (DEPRECATED - Use /health/* paths above) ---

// GET /api/admin/sync-status - Check for data inconsistencies (runs quickly on sample)
router.get('/sync-status', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const status = await SyncService.verifySyncStatus();
        res.status(200).json({ status: 'success', data: status });
    } catch (err) {
        next(err);
    }
});

// POST /api/admin/reconcile - Manual trigger for Clerk -> Neon reconciliation (heavy operation)
router.post('/reconcile', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cleanupOrphaned } = req.body;
        const result = await SyncService.reconcileClerkToNeon({ cleanupOrphaned });
        res.status(200).json({ status: 'success', message: 'Reconciliation process initiated.', data: result });
    } catch (err) {
        next(err);
    }
});

export default router
