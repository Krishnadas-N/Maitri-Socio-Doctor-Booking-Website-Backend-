import { Request, Response, NextFunction } from "express";

import { CustomError } from "./CustomError";

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
    const responseData : SuccessResponse<T>={
        success:true,
        data:data,
        message:message||"Operation successful."
    };
    res.status(200).json(responseData);
}

export const sendErrorResponse =(res:Response,errorMessage:string,errorCode ?:number): void =>{
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
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        console.log(err)
        sendErrorResponse(res, err.message, err.status);
    } else {
        console.error("Unhandled error:", err);
        sendErrorResponse(res, "Internal Server Error", 500);
    }
};

export default errorHandler;
