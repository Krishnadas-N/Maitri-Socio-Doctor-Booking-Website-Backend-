import { body, validationResult } from "express-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomError } from "../../utils/CustomError";

export const SignupValidateUser:RequestHandler[] =[
    body('profilePic').optional().isString(),
    body('firstname').trim().isString().notEmpty().withMessage('First name is required').isLength({ max: 25 }).withMessage('First name must be at most 25 characters'),
    body('lastname').trim().isString().notEmpty().withMessage('last name is required').isLength({max :25}).withMessage('last name must be atmost 25 characters'),
    body('username').optional().trim().isString().notEmpty().withMessage("Username cannot be empty"),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('email').trim().isEmail().withMessage('Invalid email format'),
    body('password').trim().isString().notEmpty().withMessage('Password is required').isLength({ max: 25 }).withMessage('Password must be at most 25 characters'),
    body('confirmPassword').trim().isString().notEmpty().withMessage('Confrim password not be Empty').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorArray = errors.array().map((err) => ({ [err.param]: err.msg }));
          const errorMessage = errorArray.map((err) => Object.values(err)).join("; ");
          throw new CustomError(errorMessage, 400);
        }
        next();
      }
]

export const loginValidateUser = [
    body('email').trim().notEmpty().withMessage('Email not be Empty').isEmail().withMessage('Invalid Email Format').normalizeEmail(),
    body('password').trim().isString().notEmpty().withMessage('Password is required').isLength({ max: 25 }).withMessage('Password must be at most 25 characters'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            const errorArray = errors.array().map((err) => ({ msg: err.msg }));
            const errorMessage = errorArray.map((err) => Object.values(err)).join("; ");
            throw new CustomError(errorMessage, 400);
        }
        next();
    }
];

