import passport from 'passport';
import { CustomError } from '../../utils/CustomError';
import { NextFunction, Request, Response } from 'express';
import { Payload } from '../models/payload.model';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    passport.authenticate('jwt', { session: false }, (err:Error, payload:Payload, info:any) => {
      if (err) {
        return next(err);
      }

      if (!payload) {
        throw new CustomError('Unauthorized User',403);
      }
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new CustomError('Token has expired', 401);
      }
      console.log(payload,"Log from payload Jwt");
      req.user = payload;
      next();
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};