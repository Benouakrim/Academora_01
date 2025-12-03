import { Request, Response, NextFunction } from 'express';
import { UniversityService } from '../services/UniversityService';

export const getUniversities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UniversityService.getAll(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUniversityBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    // Check if it's a UUID (admin edit by ID) or a Slug (public view)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    const university = isUuid 
      ? await UniversityService.getById(slug)
      : await UniversityService.getBySlug(slug);
      
    res.status(200).json(university);
  } catch (err) {
    next(err);
  }
};

export const createUniversity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const university = await UniversityService.create(req.body);
    res.status(201).json(university);
  } catch (err) {
    next(err);
  }
};

export const updateUniversity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params; // We use the ID passed in the URL param 'slug' for simplicity in routing
    const university = await UniversityService.update(slug, req.body);
    res.status(200).json(university);
  } catch (err) {
    next(err);
  }
};

export const deleteUniversity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    await UniversityService.delete(slug);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

