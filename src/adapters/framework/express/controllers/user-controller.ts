import { NextFunction, Request,Response } from "express";
import { UserAuthentication } from "../../../../core/use-cases/UserAuthentication-Use-case";
import { CustomError } from "../../../../../utils/CustomError";
import { sendSuccessResponse } from "../../../../../utils/ReponseHandler";
export class UserController{
    constructor(
        private readonly userAuth:UserAuthentication
    ) {}

    async signup(req:Request,res:Response,next:NextFunction){
        try{
        const { email, password } = req.body;
        const newUser = await this.userAuth.signup(email,password);
        res.status(201).json({message:"User created",data:newUser});
        }catch(err){
            next(err)
        }
    }

    async login(req:Request,res:Response,next:NextFunction){
        try{
        const { email, password } = req.body;
        const user = await this.userAuth.login(email,password);
        if(!user){
            throw new CustomError("Email or Password is incorrect",401);
        }
        
        sendSuccessResponse(res,user,"Login successful")
        }catch(err){
            next(err)
        }
    }
}