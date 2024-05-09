"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
const customError_1 = require("./customError");
const sendSuccessResponse = (res, data, message) => {
    console.log("Log from success Response", data);
    const responseData = {
        success: true,
        data: data,
        message: message || "Operation successful."
    };
    res.status(200).json(responseData);
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendErrorResponse = (res, errorMessage, errorCode) => {
    console.log("Log from Error Response", errorMessage);
    const errorResponse = {
        success: false,
        error: {
            message: errorMessage,
            code: errorCode
        }
    };
    res.status(errorCode || 500).json(errorResponse);
};
exports.sendErrorResponse = sendErrorResponse;
// Global error handler middleware
const errorHandler = (err, req, res) => {
    console.log("Error Handler Comes In");
    if (err instanceof customError_1.CustomError) {
        console.log("Custom Error:");
        console.error(err);
        (0, exports.sendErrorResponse)(res, err.message, err.status);
    }
    else {
        console.error("Unhandled error:", err);
        (0, exports.sendErrorResponse)(res, "Internal Server Error", 500);
    }
};
exports.default = errorHandler;
