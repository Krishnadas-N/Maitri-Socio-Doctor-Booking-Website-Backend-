import { Request,Response,NextFunction } from "express";
import { sendSuccessResponse } from "../../utils/reponseHandler"; 
import { CustomError } from "../../utils/customError"; 
import { IDoctorUsecase } from "../../domain/interfaces/use-cases/doctorUsecase";
import { assertHasUser } from "../../middlewares/requestValidationMiddleware";
// import cloudinary from "../../../config/cloudinary";

export function registerBasicInfo(doctorService: IDoctorUsecase) {
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

export function registerProfessionalInfo(doctorService: IDoctorUsecase) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            assertHasUser(req)
            const doctorId = req.user.id as string
            if(!doctorId){
                throw new CustomError('Doctor is not authenticated',401)
            }
            console.log(req.files);
            console.log(req.body)
            if (!req.files || req.files.length === 0) {
                throw new CustomError('No files uploaded', 400);
            
            }
            
            const cloudinaryUrls = req.body.cloudinaryUrls;
            if (cloudinaryUrls.length === 0) {
                console.error('No Cloudinary URLs found.');
                return res.status(500).send('Internal Server Error');
            }
            const certificationUrls: string[] = cloudinaryUrls;
            const { specialization, education, experience, languages, consultationFee ,address} = req.body;

            const doctorData=  await doctorService.registerProfessionalInfoUseCase({
                address,
                specialization,
                education,
                experience,
                certifications:certificationUrls,
                languages,
                consultationFee
            },doctorId);

            return sendSuccessResponse(res, doctorData, "Professional information registered successfully");
        } catch (err) {
            console.error("Error occurred while registering professional info:", err);
            next(err);
        }
    };
}

export function registerAdditionalInfo(doctorService: IDoctorUsecase) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            assertHasUser(req)
            const doctorId = req.user.id as string
            console.log("additional Info ",req.body,req.body.consultationFee);
          const doctorData=  await doctorService.RegisterAdditionalInfoUseCase(
               req.body
            ,doctorId);

            return sendSuccessResponse(res, doctorData, "Additional information registered successfully");
        } catch (err) {
            console.error("Error occurred while registering additional info:", err);
            next(err);
        }
    };
}

export function login(doctorService: IDoctorUsecase) {
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

export function forgotPassword(doctorService: IDoctorUsecase) {
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

export function resetPassword(doctorService: IDoctorUsecase) {
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

export function VerifyProfile(doctorService: IDoctorUsecase) {
    return async function (req:Request,res:Response,next:NextFunction){
     try{
      const doctorId = req.params.doctorId;
      if(!doctorId){
        throw new CustomError('No Id provided in the Token',400)
      }
        const doctor =await doctorService.AcceptDoctorProfile(doctorId)
        return sendSuccessResponse(res,doctor,"Password has been changed")
     }catch(error){
      next(error)
     }
  }
  }


export function getDoctors(doctorService:IDoctorUsecase){
    return async function (req:Request,res:Response,next:NextFunction){
        try{
            console.log("Log fro Dcotor Cotnrillers ********************************************");
            const page = parseInt(req.query.page as string, 10) || 1;
            const  limit = parseInt(req.query.limit as string, 10) || 25;
            const search = (req.query.search as string) || '';
            console.log(page,search,limit);
              const doctors =await doctorService.GetDoctors(page,search,limit)
              console.log("Log fro Dcotor Cotnrillers ********************************************",doctors);
              return sendSuccessResponse(res,{doctors},"Doctors Fetched Success Fully",)
           }catch(error){
            next(error)
           }
    }
}




export function getDoctorById(doctorService:IDoctorUsecase){
    return async function (req:Request,res:Response,next:NextFunction){
        console.log("GEttt Docotroe By ID   ",req.params.doctorId);
        try{
            const doctorId = req.params.doctorId;
            if(!doctorId){
                throw new CustomError('Doctor Id is not Defined',403)
            }
              const doctor =await doctorService.getDoctorById(doctorId)
              return sendSuccessResponse(res,{doctor},"Doctor Fetched Success Fully",)
           }catch(error){
            next(error)
           }
    }
}

export function getCurrentDoctor(doctorService:IDoctorUsecase){
    return async function (req:Request,res:Response,next:NextFunction){
        console.log("getCurrentDoctor   ",);
        try{
            assertHasUser(req)
            const doctorId = req.user.id;
            console.log("getCurrentDoctor   ",doctorId);
            if(!doctorId){
                throw new CustomError('Doctor Id is not Defined',403)
            }
              const doctor =await doctorService.getDoctorById(doctorId as string)
              return sendSuccessResponse(res,doctor,"Doctor Fetched Success Fully",)
           }catch(error){
            next(error)
           }
    }
}


export function updateDoctorProfilePic(doctorService:IDoctorUsecase){
    return async function (req:Request,res:Response,next:NextFunction){
        console.log("getCurrentDoctor   ",);
        try{
            assertHasUser(req)
            const doctorId = req.user.id;
            const imageUrl= req.body.cloudinaryUrls[0]
            console.log("image Url from COntrolelr",imageUrl);
            if(!doctorId){
                throw new CustomError('Doctor Id is not Defined',403)
            }
              const doctor =await doctorService.getDoctorById(doctorId as string)
              return sendSuccessResponse(res,doctor,"Doctor Fetched Success Fully",)
           }catch(error){
            next(error)
           }
    }
}


export function saveSelectedSlots(doctorService: IDoctorUsecase) {
    return async function (req: Request, res: Response, next: NextFunction) {
        console.log("getCurrentDoctor   ",req.body);
        try {
            assertHasUser(req);
            const doctorId = req.user.id;
            console.log(doctorId,req.body.selectedSlots)
            if (!doctorId) {
                throw new CustomError('Doctor Id is not defined', 403);
            }
            const doctor = await doctorService.saveSelectedSlots(doctorId as string, req.body.selectedSlots);
            return sendSuccessResponse(res, doctor, "Doctor slots saved successfully");
        } catch (error) {
            next(error);
        }
    };
    
}

export function getSimilarProfilesOfDoctors(doctorService: IDoctorUsecase) {
    return async function (req: Request, res: Response, next: NextFunction) {
        console.log("getCurrentDoctor   ",req.body);
        try {
            assertHasUser(req);
            const {specializationId} = req.params;
            console.log(specializationId)
            if (!specializationId) {
                throw new CustomError('specializationId is not defined', 403);
            }
            const doctor = await doctorService.getSimilarProfiles(specializationId)
            return sendSuccessResponse(res, doctor, "Doctor slots saved successfully");
        } catch (error) {
            next(error);
        }
    };
    
}


export function followOrUnfollowDoctors(doctorService: IDoctorUsecase) {
    return async function (req: Request, res: Response, next: NextFunction) {
        console.log("getCurrentDoctor   ",req.body);
        try {
            assertHasUser(req);
            const {doctorId} = req.params;
            const userId = req.user.id as string;
            const userType = req.user.roles[0].roleName
            if (userType !== 'Doctor' && userType !== 'User') {
                throw new CustomError('Innvalid UserRole', 400);
              }
            console.log(doctorId,userType,userId)
            const result = await doctorService.followOrUnfollowDoctors(doctorId,userId,userType)
            return sendSuccessResponse(res, result, "Doctor slots saved successfully");
        } catch (error) {
            next(error);
        }
    };
    
}

export function addReviewAndRatingOfDoctors(doctorService: IDoctorUsecase) {
    return async function (req: Request, res: Response, next: NextFunction) {
        console.log("Review Body   ",req.body);
        try {
            assertHasUser(req);
            console.log(req.params);
            const {appoinmentId} = req.params;
            const userId = req.user.id as string;
            const {rating,review} = req.body;
            const result = await doctorService.addReviewAndRating(appoinmentId,userId,rating,review)
            return sendSuccessResponse(res, result, "Doctor slots saved successfully");
        } catch (error) {
            next(error);
        }
    };
}
    

export function getDoctorDashBoardDetails(doctorService: IDoctorUsecase) {
    return async function (req: Request, res: Response, next: NextFunction) {
        console.log("getCurrentDoctor   ",req.body);
        try {
            assertHasUser(req);
            const doctorId = req.user.id as string;
            const result = await doctorService.getDoctorDashboardDetails(doctorId)
            return sendSuccessResponse(res, result, "Doctor dashboard  details fetched successfully");
        } catch (error) {
            next(error);
        }
    };
}

export function getDoctorReviews(doctorService: IDoctorUsecase) {
    return async function (req: Request, res: Response, next: NextFunction) {
        console.log(" getDoctorReviews  ",req.params);
        try {
            assertHasUser(req);
            const {doctorId} = req.params;
            const result = await doctorService.getReviewsOfDoctor(doctorId)
            return sendSuccessResponse(res, result, "Doctor Reviews  details fetched successfully");
        } catch (error) {
            next(error);
        }
    };
}
