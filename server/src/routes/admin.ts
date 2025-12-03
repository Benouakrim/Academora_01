import { Router } from 'express'
import { getStats } from '../controllers/adminController'
import { requireAdmin } from '../middleware/requireAdmin'
import { PrismaClient } from '@prisma/client'

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

export default router
