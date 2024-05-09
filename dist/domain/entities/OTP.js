"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
class OTP {
    constructor(email, otp, status, createdAt, validFor, expiresAt) {
        this.email = email;
        this.otp = otp;
        this.status = status;
        this.createdAt = createdAt;
        this.validFor = validFor;
        this.expiresAt = expiresAt;
    }
}
exports.OTP = OTP;
