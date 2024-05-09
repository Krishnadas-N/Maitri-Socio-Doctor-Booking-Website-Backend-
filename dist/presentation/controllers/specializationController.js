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
exports.SpecializationController = void 0;
const reponseHandler_1 = require("../../utils/reponseHandler");
const customError_1 = require("../../utils/customError");
class SpecializationController {
    constructor(specImpl) {
        this.specializationService = specImpl;
    }
    addSpec(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(this.specializationService);
                const data = req.body;
                const newSpec = yield this.specializationService.addSpec(data);
                return (0, reponseHandler_1.sendSuccessResponse)(res, newSpec, "Specialization added successfully");
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockSpec(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = yield this.specializationService.blockSpec(id);
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, 'specification has been successfully blocked');
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllSpec(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const specializations = yield this.specializationService.getAllSpec();
                return (0, reponseHandler_1.sendSuccessResponse)(res, specializations, "all specializations have been fetched");
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateSpec(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = Object.assign(Object.assign({}, req.body), { _id: id });
                console.log(data);
                const updatedSpec = yield this.specializationService.updateSpec(data);
                return (0, reponseHandler_1.sendSuccessResponse)(res, updatedSpec, "specialization has been successfully updated");
            }
            catch (error) {
                next(error);
            }
        });
    }
    findASpec(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const specialization = yield this.specializationService.findASpec(id);
                if (!specialization) {
                    throw new customError_1.CustomError('Specialization not found', 404);
                }
                else {
                    return (0, reponseHandler_1.sendSuccessResponse)(res, specialization, "Specialization has been found");
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SpecializationController = SpecializationController;
