import { Request,Response,NextFunction } from "express";
import { sendSuccessResponse } from "../../../utils/ReponseHandler";
import { DoctorService } from "../../domain/interfaces/use-cases/Doctor-Service/authentication/doctor-authentication";
import { CustomError } from "../../../utils/CustomError";
import { IDoctorUsecase } from "../../domain/interfaces/use-cases/Doctor-Service/Idoctor-Service";
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

export function forgotPassword(doctorService: DoctorService) {
   return async function(req: Request, res: Response, next: NextFunction){
    try{
        const {email} = req.body;
       await doctorService.forgotPassword(email);
       return sendSuccessResponse(res,{},'Message sent Successfully');
    }catch(error){
        next(error)
    }
}
}

export function resetPassword(doctorService: DoctorService) {
  return async function (req:Request,res:Response,next:NextFunction){
   try{
    const passwordToken = req.params.token
      const {newPassword}=req.body;
      await doctorService.setResetPassword(passwordToken,newPassword);
      return sendSuccessResponse(res,"Password Reset Successfully","Password has been changed")
   }catch(error){
    next(error)
   }
}
}

export function VerifyProfile(doctorService: DoctorService) {
    return async function (req:Request,res:Response,next:NextFunction){
     try{
      const doctorId = req.params.doctorId;
      if(!doctorId){
        throw new CustomError('No Id provided in the Token',400)
      }
        await doctorService.AcceptDoctorProfile(doctorId)
        return sendSuccessResponse(res,"Password Reset Successfully","Password has been changed")
     }catch(error){
      next(error)
     }
  }
  }

export function getDoctors(doctorService:IDoctorUsecase){
    return async function (req:Request,res:Response,next:NextFunction){
        try{
            const page = parseInt(req.query.page as string, 10) || 1;
            const  limit = parseInt(req.query.limit as string, 10) || 25;
            const search = (req.query.search as string) || '';
            console.log(page,search,limit);
              const doctors =await doctorService.GetDoctors(page,search,limit)
              return sendSuccessResponse(res,{doctors},"Doctors Fetched Success Fully",)
           }catch(error){
            next(error)
           }
    }
}

export function chnageStatus(doctorService:IDoctorUsecase){
    return async function (req:Request,res:Response,next:NextFunction){
        try{
            const doctorId = req.params.doctorId;
            if(!doctorId){
                throw new CustomError('Doctor Id is not Defined',403)
            }
              const doctor =await doctorService.changeDoctorStatus(doctorId)
              return sendSuccessResponse(res,{doctor},"Doctor Fetched Success Fully",)
           }catch(error){
            next(error)
           }
    }
}