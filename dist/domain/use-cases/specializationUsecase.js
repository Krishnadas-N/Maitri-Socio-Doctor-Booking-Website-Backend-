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
exports.DoctorServiceImpl = void 0;
const customError_1 = require("../../utils/customError");
class DoctorServiceImpl {
    constructor(specializationRepo) {
        this.specializationRepo = specializationRepo;
    }
    addSpec(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exist = yield this.specializationRepo.getByName(data.name);
                if (exist)
                    throw new customError_1.CustomError("This Specialization is Already Exists", 409);
                return yield this.specializationRepo.create(data);
            }
            catch (error) {
                console.error("Error while adding specialization:", error);
                throw error;
            }
        });
    }
    blockSpec(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.specializationRepo.block(id);
            }
            catch (error) {
                console.error("Error while blocking specialization:", error);
                throw error;
            }
        });
    }
    getAllSpec() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.specializationRepo.getAll();
            }
            catch (error) {
                console.error("Error while getting all specializations:", error);
                throw error;
            }
        });
    }
    updateSpec(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = data._id;
                if (!id) {
                    throw new Error("Missing ID for updating specialization");
                }
                const isExists = yield this.specializationRepo.findOne(id);
                if (!isExists) {
                    throw new customError_1.CustomError(`No such specialization with id ${id}`, 404);
                }
                return yield this.specializationRepo.update(id, data);
            }
            catch (error) {
                console.error("Error while updating specialization:", error);
                throw error;
            }
        });
    }
    findASpec(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.specializationRepo.findOne(id);
            }
            catch (error) {
                console.error("Error while finding specialization:", error);
                throw error;
            }
        });
    }
}
exports.DoctorServiceImpl = DoctorServiceImpl;
