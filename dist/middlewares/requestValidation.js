"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidateUser = exports.SignupValidateUser = void 0;
const express_validator_1 = require("express-validator");
const customError_1 = require("../utils/customError");
exports.SignupValidateUser = [
    (0, express_validator_1.body)('profilePic').optional().isString(),
    (0, express_validator_1.body)('firstName').trim().isString().notEmpty().withMessage('First name is required').isLength({ max: 25 }).withMessage('First name must be at most 25 characters'),
    (0, express_validator_1.body)('lastName').trim().isString().notEmpty().withMessage('last name is required').isLength({ max: 25 }).withMessage('last name must be atmost 25 characters'),
    (0, express_validator_1.body)('username').optional().trim().isString().notEmpty().withMessage("Username cannot be empty"),
    (0, express_validator_1.body)('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    (0, express_validator_1.body)('email').trim().isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('dateOfBirth').trim().notEmpty().withMessage('Date of birth must be filled').isDate().withMessage('Date of birth must be in date format'),
    (0, express_validator_1.body)('password').trim().isString().notEmpty().withMessage('Password is required').isLength({ max: 25 }).withMessage('Password must be at most 25 characters'),
    (0, express_validator_1.body)('confirmPassword').trim().isString().notEmpty().withMessage('Confrim password not be Empty').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    (req, res, next) => {
        console.log("Log from Signup Validator");
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array().map((err) => ({ msg: err.msg }));
            const errorMessage = errorArray.map((err) => Object.values(err)).join("; ");
            throw new customError_1.CustomError(errorMessage, 400);
        }
        next();
    }
];
exports.loginValidateUser = [
    (0, express_validator_1.body)('email').trim().notEmpty().withMessage('Email not be Empty').isEmail().withMessage('Invalid Email Format').normalizeEmail(),
    (0, express_validator_1.body)('password').trim().isString().notEmpty().withMessage('Password is required').isLength({ max: 25 }).withMessage('Password must be at most 25 characters'),
    (req, res, next) => {
        console.log("Log from Login Validator");
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            const errorArray = errors.array().map((err) => ({ msg: err.msg }));
            const errorMessage = errorArray.map((err) => Object.values(err)).join("; ");
            throw new customError_1.CustomError(errorMessage, 400);
        }
        next();
    }
];
