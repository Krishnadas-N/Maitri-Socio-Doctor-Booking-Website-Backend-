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
exports.getInterests = exports.removeInterest = exports.addToInterest = void 0;
const customError_1 = require("../../utils/customError");
const reponseHandler_1 = require("../../utils/reponseHandler");
const requestValidationMiddleware_1 = require("../../middlewares/requestValidationMiddleware");
function addToInterest(InterestedDoctorsUsecase) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { doctorId } = req.params;
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!doctorId) {
                    throw new customError_1.CustomError('Unable to get Doctor Id', 404);
                }
                const doctors = yield InterestedDoctorsUsecase.addInterestForUser(userId, doctorId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, doctors, 'Added To Interest List');
            }
            catch (err) {
                next(err);
            }
        });
    };
}
exports.addToInterest = addToInterest;
function removeInterest(InterestedDoctorsUsecase) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { doctorId } = req.params;
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!doctorId) {
                    throw new customError_1.CustomError('Unable to get Doctor Id', 404);
                }
                yield InterestedDoctorsUsecase.removeInterestForUser(userId, doctorId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, {}, 'Added To Interest List');
            }
            catch (err) {
                next(err);
            }
        });
    };
}
exports.removeInterest = removeInterest;
function getInterests(InterestedDoctorsUsecase) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                if (!userId) {
                    throw new customError_1.CustomError('Unauthorized User', 403);
                }
                const interests = yield InterestedDoctorsUsecase.getUserInterestsForUser(userId);
                console.log(interests);
                return (0, reponseHandler_1.sendSuccessResponse)(res, interests, "User Interests");
            }
            catch (err) {
                next(err);
            }
        });
    };
}
exports.getInterests = getInterests;
