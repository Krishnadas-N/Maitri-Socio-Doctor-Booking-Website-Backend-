import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/customError'; 

import { Payload } from '../models/payload.model';
import { IUserRepository } from '../domain/interfaces/repositoryInterfaces/userIRepository'; 
import { IDoctorRepository } from '../domain/interfaces/repositoryInterfaces/doctorIRepository'; 
import { IAdminRepository } from '../domain/interfaces/repositoryInterfaces/adminIRepository'; 


export class AuthMiddleware {
  constructor(
    private userRepo: IUserRepository,
    private doctorRepo: IDoctorRepository,
    private adminRepo: IAdminRepository
  ) {}

  isAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
      passport.authenticate(
        "jwt",
        { session: false },
        async (err: Error, payload: Payload, info: any) => {
          try {
            if (err) return next(err);
            if (!payload) {
              throw new CustomError("Unauthorized User", 403);
            }
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
              throw new CustomError("Token has expired", 401);
            }
            let user;
            switch (payload.roles[0].roleName) {
              case "User":
                user = await this.userRepo.findById(payload.id as string);
                break;
              case "Doctor":
                user = await this.doctorRepo.findDoctorById(
                  payload.id as string
                );
                break;
              case "Admin":
                user = await this.adminRepo.findById(payload.id as string);
                break;
              default:
                throw new CustomError("Unrecognized user role", 400);
            }
            if (!user) {
              throw new CustomError("User not found", 404);
            }
            if ("isBlocked" in user && user.isBlocked) {
              throw new CustomError("User is blocked by admin", 403);
            }
            req.user = payload;
            return next();
          } catch (error) {
            next(error);
          }
        }
      )(req, res, next);
    } catch (error) {
      console.log("errror form  auth   middleware ", error);
      next(error);
    }
  }
}
