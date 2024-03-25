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
exports.MongoDbUserDataSource = void 0;
const user_model_1 = require("./models/user-model");
class MongoDbUserDataSource {
    constructor() { }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log from user create data source");
                const createdUser = yield user_model_1.UserModel.create(user);
                console.log(createdUser);
                return createdUser.toObject();
            }
            catch (error) {
                throw new Error(`Error creating user: ${error}`);
            }
        });
    }
    getAll(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = user_model_1.UserModel.find();
                if (skip)
                    query = query.skip(skip);
                if (limit)
                    query = query.limit(limit);
                const users = yield query.exec();
                return users.map(user => user.toObject());
            }
            catch (error) {
                throw new Error(`Error getting all users: ${error}`);
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.UserModel.findOne({ email });
                return user ? user.toObject() : null;
            }
            catch (error) {
                throw new Error(`Error finding user by email: ${error}`);
            }
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.UserModel.findById(userId).exec();
                return user ? user.toObject() : null;
            }
            catch (error) {
                throw new Error(`Error finding user by ID: ${error}`);
            }
        });
    }
    updateOne(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield user_model_1.UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
                return updatedUser ? updatedUser.toObject() : null;
            }
            catch (error) {
                throw new Error(`Error updating user: ${error}`);
            }
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_model_1.UserModel.findByIdAndDelete(id).exec();
                return !!result;
            }
            catch (error) {
                throw new Error(`Error deleting user: ${error}`);
            }
        });
    }
}
exports.MongoDbUserDataSource = MongoDbUserDataSource;
