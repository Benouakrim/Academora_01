import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

type SegmentedSchema = {
  body?: AnyZodObject | ZodEffects<any>;
  query?: AnyZodObject | ZodEffects<any>;
  params?: AnyZodObject | ZodEffects<any>;
};

export const validate = (schema: SegmentedSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
