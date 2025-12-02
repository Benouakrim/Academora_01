import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { universityId } = req.params as { universityId: string };

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          universityId,
          status: 'APPROVED',
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
        },
      }),
      prisma.review.count({ where: { universityId, status: 'APPROVED' } }),
    ]);

    res.status(200).json({
      data: reviews,
      meta: { total, page, limit },
    });
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authFn = (req as any).auth as (() => { userId?: string } | undefined);
    const clerkId = typeof authFn === 'function' ? authFn()?.userId : undefined;
    if (!clerkId) throw new AppError(401, 'Unauthorized');

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new AppError(404, 'User profile not found');

    const {
      universityId,
      rating,
      academicRating,
      campusRating,
      socialRating,
      careerRating,
      title,
      content,
    } = req.body as {
      universityId: string;
      rating: number | string;
      academicRating?: number | string;
      campusRating?: number | string;
      socialRating?: number | string;
      careerRating?: number | string;
      title: string;
      content: string;
    };

    const existing = await prisma.review.findUnique({
      where: {
        userId_universityId: {
          userId: user.id,
          universityId,
        },
      },
    });

    if (existing) {
      throw new AppError(409, 'You have already reviewed this university');
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        universityId,
        rating: Number(rating),
        academicRating: academicRating !== undefined ? Number(academicRating) : null,
        campusRating: campusRating !== undefined ? Number(campusRating) : null,
        socialRating: socialRating !== undefined ? Number(socialRating) : null,
        careerRating: careerRating !== undefined ? Number(careerRating) : null,
        title,
        content,
        status: 'APPROVED',
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const authFn = (req as any).auth as (() => { userId?: string } | undefined);
    const clerkId = typeof authFn === 'function' ? authFn()?.userId : undefined;
    if (!clerkId) throw new AppError(401, 'Unauthorized');

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new AppError(404, 'User not found');

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throw new AppError(404, 'Review not found');

    if (review.userId !== user.id) {
      throw new AppError(403, 'You can only delete your own reviews');
    }

    await prisma.review.delete({ where: { id } });

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
