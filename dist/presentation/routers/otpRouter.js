"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRouter = void 0;
const mongodbOtpDataSource_1 = require("../../data/data-sources/mongodb/mongodbOtpDataSource");
const otpRepository_1 = require("../../domain/repositories/otpRepository");
const otpUsecase_1 = require("../../domain/use-cases/otpUsecase");
const express_1 = require("express");
const otpController_1 = require("../controllers/otpController");
const userRepository_1 = require("../../domain/repositories/userRepository");
const mongodbUserDataSource_1 = require("../../data/data-sources/mongodb/mongodbUserDataSource");
const doctorRepository_1 = require("../../domain/repositories/doctorRepository");
const mongodbDoctorDataSource_1 = require("../../data/data-sources/mongodb/mongodbDoctorDataSource");
exports.otpRouter = (0, express_1.Router)();
const doctorDataSource = new mongodbDoctorDataSource_1.MongoDbDoctorDataSourceImpl();
const doctorRepository = new doctorRepository_1.IDoctorRepositoryImpl(doctorDataSource);
const userRepository = new userRepository_1.UserRepository(new mongodbUserDataSource_1.MongoDbUserDataSource());
const otpRepository = new otpRepository_1.OTPRepsositoryImpl(new mongodbOtpDataSource_1.MongoDbOtpDataSource());
const otpService = new otpUsecase_1.OTPServiceImpl(otpRepository, userRepository, doctorRepository);
const verifyOtpMiddleware = new otpController_1.VerifyOtpMiddleware(otpService);
const resendOtpMiddleware = new otpController_1.ResendOtpMiddleware(otpService);
exports.otpRouter.post('/verify', verifyOtpMiddleware.handle.bind(verifyOtpMiddleware));
exports.otpRouter.post('/resend', resendOtpMiddleware.handle.bind(resendOtpMiddleware));
exports.default = exports.otpRouter;
