import { Request,Response,NextFunction } from "express";
import { sendSuccessResponse } from "../../../utils/ReponseHandler";
import { DoctorService } from "../../domain1/interfaces/use-cases/Doctor-Service/authentication/doctor-authentication";
import { CustomError } from "../../../utils/CustomError";

export function registerBasicInfo(doctorService: DoctorService) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, gender, dateOfBirth,password, email, phone } = req.body;

           const token = await doctorService.registerBasicInfoUseCase({
                firstName,
                lastName,
                gender,
                dateOfBirth,
                email,
                phone,
                password
            });

            return sendSuccessResponse(res, {token}, "Basic information registered successfully and otp send to Doctor ema");
        } catch (err) {
            console.error("Error occurred while registering basic info:", err);
            next(err);
        }
    };
}

export function registerProfessionalInfo(doctorService: DoctorService) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const token: string | undefined = req.query.token as string | undefined;
            if(!token){
                throw new CustomError("Token is Not found in query",401);
            }
            const { specialization, education, experience, certifications, languages, consultationFee } = req.body;

            await doctorService.registerProfessionalInfoUseCase({
                specialization,
                education,
                experience,
                certifications,
                languages,
                consultationFee
            },token);

            return sendSuccessResponse(res, null, "Professional information registered successfully");
        } catch (err) {
            console.error("Error occurred while registering professional info:", err);
            next(err);
        }
    };
}

export function registerAdditionalInfo(doctorService: DoctorService) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const token: string | undefined = req.query.token as string | undefined;
            if(!token){
                throw new CustomError("Token is Not found in query",401);
            }
            const { profilePic, bio, availability, maxPatientsPerDay, onlineConsultation } = req.body;

            await doctorService.RegisterAdditionalInfoUseCase({
                profilePic,
                bio,
                availability,
                maxPatientsPerDay,
                onlineConsultation
            },token);

            return sendSuccessResponse(res, null, "Additional information registered successfully");
        } catch (err) {
            console.error("Error occurred while registering additional info:", err);
            next(err);
        }
    };
}

export function login(doctorService: DoctorService) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const doctor = await doctorService.login(email, password);

            if (!doctor) {
              throw new CustomError( "Invalid credentials", 401);
            }

            return sendSuccessResponse(res, doctor, "Login successful");
        } catch (err) {
            console.error("Error occurred during login:", err);
            next(err);
        }
    };
}