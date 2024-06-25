import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../utils/customError";
import { sendSuccessResponse } from "../../utils/reponseHandler"; 
import { IUserUseCase } from "../../domain/interfaces/use-cases/userIUsecase";
import { assertHasUser } from "../../middlewares/requestValidationMiddleware";
import { EditProfileDto ,GoogleCredentials} from "../../models/users.model";
import admin from "firebase-admin";

export class UserController{
    constructor(
        private userUseCase:IUserUseCase,
    ) {
    }
    async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const userData = await this.userUseCase.login(email, password);
            console.log("Log form User",userData);
            if (!userData) {
                throw new CustomError("Email or Password is incorrect", 401);
            }
            return sendSuccessResponse(res, userData, "Login successful");
        } catch (err) {
            
            next(err);
        }
    }
    async socialLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const headers = req.headers['x-social-login'];
            if (headers !== 'google') {
                throw new CustomError('Invalid social login provider', 400);
            }
            const userData: GoogleCredentials = req.body;
             const token = userData.stsTokenManager.accessToken;
            const ticket = await admin.auth().verifyIdToken(token);
            console.log(ticket);
            const data = await this.userUseCase.socalSignUp({
                firstName:req.body.displayName.split(' ')[0],
                lastName:req.body.displayName.split(' ').slice(1).join(' '),
                email:req.body.email,
                profilePic:req.body.photoURL,
                username:req.body.displayName
            });
            console.log("login social form User",userData,data);
            if (!data) {
                throw new CustomError("Failed to sign up user", 401);
              }
            return sendSuccessResponse(res, data, "Login successful");
        } catch (err) {
            
            next(err);
        }
    }

    async signupUser(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Log from Controllers (1)");
            const token = await this.userUseCase.signUp(req.body);
            return sendSuccessResponse(res, {token}, "User created successful");
        } catch (err) {
            next(err);
        }
    }


    async getUserProfile(req: Request, res: Response, next: NextFunction){
        try{
        assertHasUser(req)
         const userId = req.user.id;
         console.log(userId,"User Id");
         const userProfile = await this.userUseCase.profile(userId as string);
         return  sendSuccessResponse(res, userProfile,"user profile fetched successfully");
        }catch(error){
            next(error)
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction){
        try{
            const {email} = req.body;
           const message=await this.userUseCase.forgotPassword(email);
           return sendSuccessResponse(res,message,'Message sent Successfully');
        }catch(error){
            next(error)
        }
    }

    async  resetPassword(req:Request,res:Response,next:NextFunction){
       try{
        const passwordToken = req.params.token
          const {newPassword}=req.body;
          console.log(passwordToken,"token",newPassword)
          await this.userUseCase.setResetPassword(passwordToken,newPassword);
          return sendSuccessResponse(res,"Password Reset Successfully","Password has been changed")
       }catch(error){
        next(error)
       }
   }


    async BlockOrUnBlokUser(req: Request, res: Response,next:NextFunction){
        try {
            const  userId = req.params.userId;
            const user = await this.userUseCase.BlockOrUnblockUser(userId);
            return sendSuccessResponse(res,user,'Message sent Successfully');
        } catch (error) {
            console.error('Error fetching While Blocking User:', error);
           next(error)
        }
    }

    async getUserById(req: Request, res: Response,next:NextFunction){
        try {
            const userId=req.params.userId;
            const userProfile = await this.userUseCase.profile(userId);
            return  sendSuccessResponse(res, userProfile,"user profile fetched successfully");
        } catch (error) {
            console.error('Error fetching While Blocking User:', error);
           next(error)
        }
    }

    async editUserProfile(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId=req.user.id;
            const { firstName, lastName, username, dateOfBirth, gender }: EditProfileDto = req.body;
            const updatedProfile = await this.userUseCase.editUserProfile(userId as string, {
                firstName,
                lastName,
                username,
                dateOfBirth,
                gender,
              });
            return  sendSuccessResponse(res, updatedProfile,"user profile Edited successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }


    async ChangeUserProfile(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId=req.user.id;
            const imageUrl= req.body.cloudinaryUrls[0]
            console.log("image Url from COntrolelr",imageUrl);
            await this.userUseCase.changeProfilePic(userId as string ,imageUrl );
            return  sendSuccessResponse(res, imageUrl,"user profile Edited successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async changePassword(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId=req.user.id;
            await this.userUseCase.changeUserPassword(userId as string);
            return  sendSuccessResponse(res, {},"Reset password Link shared Successfully to Your email");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    


    async addUserMedicalRecord(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const { title, description } = req.body;
            const fileUrl = req.body.cloudinaryUrls[0]
            console.log("File url of medical record",fileUrl);
            const userId = req.user.id as string
            const medicalRecord = await this.userUseCase.addMedicalRecord(userId, fileUrl, title, description);
              if (!medicalRecord) {
                throw new CustomError('Failed to add medical record',400)
              }
            return  sendSuccessResponse(res,medicalRecord,"new Medical record saved Successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }
    async getUserMedicalRecords(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId = req.user.id as string
            const medicalRecord = await this.userUseCase.getUserMedicalRecords(userId);
            console.log(medicalRecord);
              if (!medicalRecord) {
                throw new CustomError('Failed to get medical record',400)
              }
            return  sendSuccessResponse(res,medicalRecord,"new Medical record saved Successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async getUserTokenByRefreshing(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const refreshToken = req.headers['authorization'];
            const token = await this.userUseCase.getUserByRefreshToken(refreshToken  as string);
              if (!token) {
                throw new CustomError('Failed to invoke a new token ',400)
              }
            return sendSuccessResponse(res,token,"New Token generated Successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }
    
    async deleteMedicalRecord(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId = req.user.id as string
            const {recordId} = req.params
            await this.userUseCase.deleteMedicalRecord(recordId,userId) 
            return sendSuccessResponse(res,{},"Record deleted Successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async surveyAnalizing(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const surveyData = req.body;
            const result = await this.userUseCase.calculateRecommendedCategories(surveyData)
            return sendSuccessResponse(res,result,"Surevey result are sended successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async getDoctorsByCategories(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const result = await this.userUseCase.getCategorizedDoctors()
            return sendSuccessResponse(res,result,"Doctors by categories result are retrieved  successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }
}