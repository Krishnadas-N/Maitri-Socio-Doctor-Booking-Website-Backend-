import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/reponseHandler"; 
import { IConsultationUsecase } from "../../domain/interfaces/use-cases/consultationIUsecase";
import { assertHasUser } from "../../middlewares/requestValidationMiddleware";
import { CustomError } from "../../utils/customError"; 
import { findDoctorsQueryParams } from "../../models/consultation.model"; 

export class ConsultationController{
    constructor(
        private consultationUseCase:IConsultationUsecase,
        
    ) {
    }

    async getDoctors(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const queryParams = req.query;
            console.log("queryParams",queryParams);
            const data = await this.consultationUseCase.getAllDoctors(queryParams as unknown as findDoctorsQueryParams)
            return  sendSuccessResponse(res, data,"Appoinment Successfully saved");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async makeAnAppoinment(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId=req.user.id;
            const {doctorId} = req.params
            console.log(req.body);
            const data = await this.consultationUseCase.makeDoctorAppoinment(userId as string,doctorId as string,req.body.appoinmentData);
            return  sendSuccessResponse(res, data,"Appoinment Successfully saved");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async getAppoinmentDetails(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const {appoinmentId} = req.params
            console.log(req.body);
            const data = await this.consultationUseCase.getAppoinmentDetails(appoinmentId as string);
            return  sendSuccessResponse(res, data,"Appoinment Successfully saved");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }
    async createPayment(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const {paymentMethod} = req.body;
            const token = req.body.token ? req.body.token:null
            const {appoinmentId} = req.params
            console.log(req.body);
            const data = await this.consultationUseCase.createOrder(appoinmentId as string,paymentMethod,token);
            return  sendSuccessResponse(res, data,"Appoinment Successfully saved");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async verifyWebhook(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const { orderId, paymentId, razorpaySignature } = req.body;
            const data = await this.consultationUseCase.verifyWebhook(orderId, paymentId, razorpaySignature);
            return  sendSuccessResponse(res, data,"Appoinment Successfully saved");
        } catch (error) {
            next(error)
        }
    }

    async getDoctorAppoinments(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 6;
            const doctorId = req.user.id;
            console.log(doctorId);
            const data = await this.consultationUseCase.getDoctorsAppoinments(doctorId as string,page,pageSize);
            return  sendSuccessResponse(res, data,"Appoinment Successfully saved");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async getUserAppoinments(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 6;
            const userId = req.user.id;
            console.log(userId);
            const data = await this.consultationUseCase.getUsersAppoinments(userId as string,page,pageSize);
            return  sendSuccessResponse(res, data,"Appoinment Successfully saved");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }
    async changeAppoinmentStatusByDoctor(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const appoinmentId = req.params.appointmentId as string;
            const userId = req.user.id;
            const userType = req.user.roles[0].roleName
            console.log(userId);
            const data = await this.consultationUseCase.changeAppoinmentStatus(appoinmentId,req.body.status,userId as string,userType);
            return  sendSuccessResponse(res, data,"Appoinment status changed successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }
    async changeAppoinmentStatusByUser(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const appoinmentId = req.params.appointmentId as string;
            const userId = req.user.id;
            console.log(userId);
            const status = req.body.status as string; 
            if (status !== 'Cancelled') {
                throw new CustomError('Invalid Status', 400);
            }
            const data = await this.consultationUseCase.userAppoinmentCancellation(appoinmentId,'Cancelled',userId as string);
            return  sendSuccessResponse(res, data,"Appoinment status changed successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }
    async getDoctorAvailableSlots(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId = req.user.id;
            let date: Date;
            if (req.query.date) {
                date = new Date(req.query.date as string);
            }else{
                throw new CustomError('Date is not Provided', 400);
            }
            const {doctorId} = req.params;
            console.log(userId);
            const data = await this.consultationUseCase.getDoctorAvailableSlots(doctorId,date)
            return  sendSuccessResponse(res, data,"Doctor Slots are Fetched successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

   async savePrescriptionOfPatients(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const {appoinmentId} =  req.params
            const doctorId = req.user.id as string;
            const prescriptionurl = req.body.cloudinaryUrls[0]
            const {title} =req.body
             await this.consultationUseCase.savePrescriptionOfPatient(appoinmentId,prescriptionurl,title,doctorId)
            return  sendSuccessResponse(res, {},"Doctor Slots are Fetched successfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async userRequestToCancelAppoinment(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const {appointmentId} =  req.params
            const userId = req.user.id as string;
            const {reason} =req.body
            console.log(appointmentId,userId,reason);
            const data = await this.consultationUseCase.userRequestToCancelAppoinment(appointmentId,userId,reason)
            return  sendSuccessResponse(res, data,"Appoinment cancellation Request submitted Succesfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async ChangeStatusOfappoinmentCancellationRequest(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const {appointmentId} =  req.params
            const doctorId = req.user.id as string;
            const {status} =req.body
            console.log(appointmentId,doctorId,status);
            const data = await this.consultationUseCase.ChangeStatusOfappoinmentCancellationRequest(appointmentId,status,doctorId)
            return  sendSuccessResponse(res, data,"Appoinment cancellation Request submitted Succesfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async getPrescriptionsOfUser(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId = req.user.id as string;
            const data = await this.consultationUseCase.getAppointmentsWithPrescriptions(userId)
            return  sendSuccessResponse(res, data,"Appoinment cancellation Request submitted Succesfully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

}