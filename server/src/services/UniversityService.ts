import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class UniversityService {
  // --- Read ---
  static async getAll(filters: any) {
    const { q, country, maxTuition, minGpa, page = 1, pageSize = 20 } = filters;
    const where: Prisma.UniversityWhereInput = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (country && country !== 'all') {
      where.country = { equals: country, mode: 'insensitive' };
    }
    if (maxTuition) {
      where.tuitionOutState = { lte: Number(maxTuition) };
    }
    if (minGpa) {
      where.minGpa = { lte: Number(minGpa) };
    }

    const take = Number(pageSize);
    const skip = (Number(page) - 1) * take;

    const [data, total] = await Promise.all([
      prisma.university.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      prisma.university.count({ where })
    ]);

    return { data, meta: { total, page, pageSize } };
  }

  static async getBySlug(slug: string) {
    const university = await prisma.university.findUnique({ where: { slug } });
    if (!university) throw new AppError(404, 'University not found');
    return university;
  }

  static async getById(id: string) {
    const university = await prisma.university.findUnique({ where: { id } });
    if (!university) throw new AppError(404, 'University not found');
    return university;
  }

  // --- Write ---
  static async create(data: Prisma.UniversityCreateInput) {
    // Ensure slug uniqueness
    const existing = await prisma.university.findUnique({ where: { slug: data.slug } });
    if (existing) throw new AppError(409, 'University with this slug already exists');

    return prisma.university.create({ data });
  }

  static async update(id: string, data: Prisma.UniversityUpdateInput) {
    try {
      return await prisma.university.update({
        where: { id },
        data,
      });
    } catch (err: any) {
      if (err.code === 'P2025') throw new AppError(404, 'University not found');
      throw err;
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.university.delete({ where: { id } });
    } catch (err: any) {
      if (err.code === 'P2025') throw new AppError(404, 'University not found');
      throw err;
    }
  }
}
