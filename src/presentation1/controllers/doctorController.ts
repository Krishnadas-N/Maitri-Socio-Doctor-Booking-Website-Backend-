import { Request,Response,NextFunction } from "express";
import { sendSuccessResponse } from "../../../utils/ReponseHandler";
import { DoctorService } from "../../domain1/interfaces/use-cases/Doctor-Service/authentication/doctor-authentication";
import { CustomError } from "../../../utils/CustomError";
// import cloudinary from "../../../config/cloudinary";

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
            console.log(req.body)
            const token: string | undefined = req.query.authToken as string | undefined;
            if(!token){
                throw new CustomError("Token is Not found in query",401);
            }
            if (!req.files || req.files.length === 0) {
                throw new CustomError('No files uploaded', 400);
            
            }
            
            const cloudinaryUrls = req.body.cloudinaryUrls;
            if (cloudinaryUrls.length === 0) {
                console.error('No Cloudinary URLs found.');
                return res.status(500).send('Internal Server Error');
            }
            const certificationUrls: string[] = cloudinaryUrls;
            const { specialization, education, experience, languages, consultationFee } = req.body;

            const doctorData=  await doctorService.registerProfessionalInfoUseCase({
                specialization,
                education,
                experience,
                certifications:certificationUrls,
                languages,
                consultationFee
            },token);

            return sendSuccessResponse(res, doctorData, "Professional information registered successfully");
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

            const { profilePic, bio, availability, maxPatientsPerDay, typesOfConsultation } = req.body;

          const doctorData=  await doctorService.RegisterAdditionalInfoUseCase({
                profilePic,
                bio,
                availability,
                maxPatientsPerDay,
                typesOfConsultation
            },token);

            return sendSuccessResponse(res, doctorData, "Additional information registered successfully");
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

            const doctorLoggedInData = await doctorService.login(email, password);

            if (!doctorLoggedInData) {
              throw new CustomError( "Invalid credentials", 401);
            }

            return sendSuccessResponse(res, doctorLoggedInData, "Login successful");
        } catch (err) {
            console.error("Error occurred during login:", err);
            next(err);
        }
    };
}