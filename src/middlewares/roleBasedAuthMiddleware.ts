
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../utils/CustomError';

export const checkRolesAndPermissions = (requiredRoles: string[], requiredPermission: string) => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
        
      const user = req.user;
      console.log("Log form Auth ROle",req.user,user);
      if (!user || !req.user) {
        throw new CustomError('User not found.' ,401)
      }
      console.log("Require Roles",requiredRoles,user.roles);
      const hasRequiredRole = requiredRoles.some(role => user.roles.map((r:any) => r.roleName).includes(role));
      if (!hasRequiredRole) {
        throw new CustomError('Access forbidden. Insufficient role.' ,403)
      }
      console.log(hasRequiredRole);
  
      if (!user.roles.some((role:any) => role.permissions.includes(requiredPermission))) {
        throw new CustomError('Access forbidden. Insufficient permissions.' ,403)
      }
  
      next();
    } catch (error) {
      console.log("errror form  auth Role  middleware ", error);
        next(error); // Pass the error to the error handling middleware
    }
  }
  };