import { NextFunction, Request, Response } from "express";
import { IInterestedDoctorsUseCase } from "../../domain/interfaces/use-cases/UserService/IinterstedDoctors-usercase";
import { CustomError } from "../../../utils/CustomError";
import { sendSuccessResponse } from "../../../utils/ReponseHandler";
import { assertHasUser } from "../../middlewares/requestValidationMiddleware";



   export function addToInterest(InterestedDoctorsUsecase:IInterestedDoctorsUseCase){
        return async function (req:Request,res:Response,next:NextFunction){
            try{
                const {doctorId} = req.params;
                assertHasUser(req)
                const userId = req.user?.id
                
                if(!doctorId){
                    throw new CustomError('Unable to get Doctor Id',404)
                }
                const doctors = await InterestedDoctorsUsecase.addInterestForUser(userId as string, doctorId);
                return sendSuccessResponse(res,doctors,'Added To Interest List')
            }catch(err){
                next(err)
            }
        }
    }


    export function  removeInterest(InterestedDoctorsUsecase:IInterestedDoctorsUseCase){
        return async function (req:Request,res:Response,next:NextFunction){
            try{
                const {doctorId} = req.params;
                assertHasUser(req)
                const userId = req.user?.id
                if(!doctorId){
                    throw new CustomError('Unable to get Doctor Id',404)
                }
               await InterestedDoctorsUsecase.removeInterestForUser(userId as string, doctorId);
                return sendSuccessResponse(res,{},'Added To Interest List')
            }catch(err){
                next(err)
            }
        }
    }

    export function  getInterests(InterestedDoctorsUsecase:IInterestedDoctorsUseCase){
        return async function (req:Request,res:Response,next:NextFunction){
            try{
                assertHasUser(req)
                const userId = req.user?.id
                if(userId){
                    throw new CustomError('Unauthorized User',403);
                }
                const interests= await InterestedDoctorsUsecase.getUserInterestsForUser(userId as string);
                return sendSuccessResponse(res,interests,"User Interests")
            }catch(err){
                next(err)
            }
        }
    }