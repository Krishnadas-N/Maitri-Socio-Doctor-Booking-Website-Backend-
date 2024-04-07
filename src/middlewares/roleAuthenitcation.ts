import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../utils/CustomError'; // Import your custom error class

// export const requireRole = (roleName: string) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userRole = req.user;
//         if (!userRole || userRole.name !== roleName) {
//           throw new CustomError('Unauthorized', 403);
//         }
//         next();
//       } catch (error) {
//         next(error);
//       }
//   };
// };
