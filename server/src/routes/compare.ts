import { Router } from 'express';
import * as controller from '../controllers/compareController';

const router = Router();

// Public route for bulk university comparison
router.get('/', controller.getBulkDetailsBySlugs);

export default router;
