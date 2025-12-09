import { Router } from 'express';
import { getUniversities, getUniversityBySlug, createUniversity, updateUniversity, deleteUniversity } from '../controllers/universityController';
import { validate } from '../middleware/validate';
import { searchUniversitiesSchema } from '../validation/universitySchemas';
import { requireAdmin } from '../middleware/requireAdmin';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// Public
router.get('/', validate(searchUniversitiesSchema), getUniversities);
router.get('/search', validate(searchUniversitiesSchema), getUniversities); // Add search alias
router.get('/:slug', getUniversityBySlug);

// Admin Only
router.post('/', requireAuth, requireAdmin, createUniversity);
router.put('/:slug', requireAuth, requireAdmin, updateUniversity); // :slug here serves as ID for updates
router.delete('/:slug', requireAuth, requireAdmin, deleteUniversity);

export default router;

