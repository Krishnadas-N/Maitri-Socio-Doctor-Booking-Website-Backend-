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
exports.IDoctorSpecializtionRepoImpl = void 0;
const customError_1 = require("../../utils/customError");
class IDoctorSpecializtionRepoImpl {
    constructor(SpecDataSource) {
        this.SpecDataSource = SpecDataSource;
    }
    block(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.SpecDataSource.blockSpec(id);
            }
            catch (error) {
                // Handle errors
                console.error("Error while blocking specialization:", error);
                throw new customError_1.CustomError(error.message || "Error while blocking specialization", 500); // Rethrow the error to the caller
            }
        });
    }
    create(specData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.SpecDataSource.create(specData);
            }
            catch (error) {
                // Handle errors
                console.error("Error while creating specialization:", error);
                throw new customError_1.CustomError(error.message || "Error while creating specialization", 500);
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.SpecDataSource.findAll();
            }
            catch (error) {
                console.error("Error while getting all specializations:", error);
                throw new customError_1.CustomError(error.message || "Error while getting all specializations", 500);
            }
        });
    }
    update(id, specData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.SpecDataSource.updateSpec(id, specData);
            }
            catch (error) {
                console.error("Error while updating specialization:", error);
                throw new customError_1.CustomError(error.message || "Error while updating specializationError while updating specialization", 500);
            }
        });
    }
    findOne(id) {
        try {
            return this.SpecDataSource.findOne(id);
        }
        catch (error) {
            console.error("Error while Fetching a specialization:", error);
            throw new customError_1.CustomError(error.message || "Error while Fetching a specialization", 500);
        }
    }
    getByName(name) {
        try {
            return this.SpecDataSource.getByName(name);
        }
        catch (error) {
            console.error("Error while Fetching a specialization:", error);
            throw new customError_1.CustomError(error.message || "Error while Fetching a specialization", 500);
        }
    }
}
exports.IDoctorSpecializtionRepoImpl = IDoctorSpecializtionRepoImpl;
