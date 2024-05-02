import passport from 'passport';
import { CustomError } from '../../utils/CustomError';
import { NextFunction, Request, Response } from 'express';
import { Payload } from '../models/payload.model';
import { UserRepository } from '../domain/interfaces/repositories/user-IRepository';
import { IDoctorsRepository } from '../domain/interfaces/repositories/Doctor-Repository';
import { IAdminRepo } from '../domain/interfaces/repositories/Admin-Repository';
import { Socket } from 'socket.io';

export class  AuthMiddleware {
  constructor(
    private userRepo:UserRepository,
    private doctorRepo:IDoctorsRepository,
    private adminRepo:IAdminRepo
  ){}

  isAuthenticated (req: Request, res: Response, next: NextFunction) {
  try {
    passport.authenticate('jwt', { session: false }, async (err:Error, payload:Payload, info:any) => {
      try {
      if (err) {
        return next(err);
      }
      console.log(payload,"LOG FROM PASSPORT");

      if (!payload) {
        throw new CustomError('Unauthorized User',403);
      }
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new CustomError('Token has expired', 401);
      }
      console.log("payload/////////////////////////////////////////////////////////",payload,payload.id);
      let user;
      switch (payload.roles[0].roleName) {
        case 'User':
          user = await this.userRepo.findById(payload.id as string);
          break;
        case 'Doctor':
          user = await this.doctorRepo.findDoctorById(payload.id as string);
          break;
        case 'Admin':
          user = await this.adminRepo.findById(payload.id as string);
          break;
        default:
          throw new CustomError('Unrecognized user role', 400);
      }

      if (!user) {
        throw new CustomError('User not found', 404);
      }
      if ('isBlocked' in user && user.isBlocked) {
        throw new CustomError('User is blocked by admin', 403);
      }
      console.log(user);
      console.log(payload,"Log from payload Jwt");
      req.user = payload;
     return next();
    } catch (error) {
       next(error); // Pass the error to the error-handling middleware
    }})(req, res, next);
  } catch (error) {

    console.log("errror form  auth   middleware ", error);
    next(error);
  }
 }  


  
}
