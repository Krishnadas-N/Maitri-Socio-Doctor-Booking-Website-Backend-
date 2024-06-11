import { Request, Response } from "express";

import { CustomError } from "./customError";

interface  SuccessResponse<T>{
    success:true,
    data?:T | undefined,
    message:string
}

interface  ErrorResponse{
    success:false,
    error:{
        message:string,
        code? :  number
    }
}

export  const sendSuccessResponse = <T>(res:Response ,data?: T ,message ?: string):void=>{
    console.log("Log from success Response",data)
    const responseData : SuccessResponse<T>={
        success:true,
        data:data,
        message:message||"Operation successful."
    };
    
     res.status(200).json(responseData);
}

export const sendErrorResponse =(res:Response,errorMessage:string,errorCode ?:number): void =>{
    console.warn(" 😒😒😒😒😒😒😒Log from Error Response ",errorMessage,"😒😒😒😒😒😒😒")
    const errorResponse:ErrorResponse={
    success:false,
    error: {
        message: errorMessage,
        code: errorCode
      }
    }

     res.status(errorCode || 500).json(errorResponse);
}


// Global error handler middleware
const errorHandler = (err: Error, req: Request, res: Response) => {
    console.log("Error Handler Comes In")
    if (err instanceof CustomError) {
        console.log("Custom Error:");
        console.error(err);
        sendErrorResponse(res, err.message, err.status);
    } else {
        console.error("Unhandled error:", err);
        sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default errorHandler;
