"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, status) {
        console.log("Error from custom error defifnition");
        super(message);
        this.status = status;
    }
}
exports.CustomError = CustomError;
