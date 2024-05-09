"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterestedDoctors = void 0;
const customError_1 = require("../../utils/customError");
class InterestedDoctors {
    constructor(interestedDoctorsRepo) {
        this.interestedDoctorsRepo = interestedDoctorsRepo;
    }
    addInterestForUser(userId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.interestedDoctorsRepo.addInterest(userId, doctorId);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'INTEREST_ADD_FAIL', 409);
                }
            }
        });
    }
    getUserInterestsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.interestedDoctorsRepo.getUserInterests(userId);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'INTEREST_Get_FAIL', 409);
                }
            }
        });
    }
    removeInterestForUser(userId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.interestedDoctorsRepo.removeInterest(userId, doctorId);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'INTEREST_REMOVE_FAIL', 409);
                }
            }
        });
    }
}
exports.InterestedDoctors = InterestedDoctors;
