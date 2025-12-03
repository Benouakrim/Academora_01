import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

/**
 * Bulk fetch university details by slugs for comparison
 * GET /compare?slugs=harvard,stanford,mit
 */
export const getBulkDetailsBySlugs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slugsParam = req.query.slugs as string;

    if (!slugsParam) {
      throw new AppError(400, 'Slugs parameter is required');
    }

    // Parse comma-separated slugs
    const slugsArray = slugsParam.split(',').map(s => s.trim()).filter(Boolean);

    if (slugsArray.length === 0) {
      throw new AppError(400, 'At least one slug is required');
    }

    if (slugsArray.length > 5) {
      throw new AppError(400, 'Maximum 5 universities can be compared at once');
    }

    // Fetch all universities in a single query
    const universities = await prisma.university.findMany({
      where: {
        slug: { in: slugsArray }
      }
    });

    // Return universities in the order they were requested
    const orderedUniversities = slugsArray
      .map(slug => universities.find(u => u.slug === slug))
      .filter(Boolean);

    res.status(200).json(orderedUniversities);
  } catch (err) {
    next(err);
  }
};
