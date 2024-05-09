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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbUserDataSource = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customError_1 = require("../../../utils/customError");
const User_1 = require("../../../domain/entities/User");
const userMedicalRecordModel_1 = require("./models/userMedicalRecordModel");
const roleModel_1 = require("./models/roleModel");
const userModel_1 = require("./models/userModel");
class MongoDbUserDataSource {
    constructor() { }
    static isUserExists(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id) {
                return userModel_1.userModel.findById(id);
            }
            else if (email) {
                return userModel_1.userModel.findOne({ email: email });
            }
            else {
                throw new Error("Invalid arguments. Please provide either ID or email.");
            }
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log from user create data source");
                const createdUser = yield userModel_1.userModel.create(user);
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
                let query = userModel_1.userModel.find();
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
                const userDocument = yield userModel_1.userModel.findOne({ email });
                if (userDocument) {
                    console.log(userDocument, "Log from Amdin");
                    const user = User_1.User.fromJSON(userDocument);
                    console.log(user, "Log from Amdin");
                    return this.convertToDomain(user);
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw new Error(`Error finding user by email: ${error}`);
            }
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.userModel.findById(userId).exec();
                console.log(user, "user from databse");
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
                const updatedUser = yield userModel_1.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
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
                const result = yield userModel_1.userModel.findByIdAndDelete(id).exec();
                return !!result;
            }
            catch (error) {
                throw new Error(`Error deleting user: ${error}`);
            }
        });
    }
    verifyUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.userModel.updateOne({ email }, { $set: {
                        isVerified: true
                    } });
            }
            catch (error) {
                throw new Error(`Error deleting user: ${error}`);
            }
        });
    }
    findResetTokenAndSavePassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.userModel.findOne({ resetToken: token }).exec();
                if (!user) {
                    throw new customError_1.CustomError('User not found or unauthorized', 404);
                }
                user.password = password;
                user.resetToken = null;
                yield user.save();
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                console.error('Unexpected error:', error);
                throw new Error(error.message || 'Internal server error');
            }
        });
    }
    saveResetToken(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(token, email, '///////////////////////////');
                const user = yield userModel_1.userModel.findOne({ email });
                if (!user) {
                    throw new customError_1.CustomError('User not found or unauthorized', 404);
                }
                if (!user.isVerified) {
                    throw new customError_1.CustomError('User Crenditals is Not Verified', 403);
                }
                user.resetToken = token;
                yield user.save();
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                console.error('Unexpected error:', error);
                throw new Error(error.message || 'Internal server error');
            }
        });
    }
    getAllUsers(searchQuery, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(searchQuery, 'i');
                const offset = (page - 1) * pageSize;
                const users = yield userModel_1.userModel.find({
                    $or: [
                        { firstName: { $regex: regex } },
                        { lastName: { $regex: regex } },
                        { username: { $regex: regex } }
                    ]
                }).skip(offset).limit(pageSize);
                const totalCount = yield userModel_1.userModel.countDocuments({
                    $or: [
                        { firstname: { $regex: regex } },
                        { lastname: { $regex: regex } },
                        { username: { $regex: regex } }
                    ]
                });
                return {
                    users: users.map(user => user.toObject()),
                    totalCount
                };
            }
            catch (error) {
                throw new Error(`Error getting users: ${error}`);
            }
        });
    }
    toggleBlockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.userModel.findById(id);
            if (!user) {
                throw new customError_1.CustomError('User not found', 404);
            }
            user.isBlocked = !user.isBlocked;
            yield user.save();
            return user.toObject();
        });
    }
    editProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield userModel_1.userModel.findByIdAndUpdate(userId, data, { new: true });
            if (!updatedUser) {
                throw new customError_1.CustomError('User Not Found', 404);
            }
            return updatedUser;
        });
    }
    changeProfilePic(userId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.userModel.updateOne({ _id: userId }, { $set: { profilePic: image } });
        });
    }
    convertToDomain(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!user)
                return null;
            console.log("Log from convertToDomain", user);
            const roleIds = ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.map(role => role.toString())) || [];
            const roleDetails = yield this.fetchRoleDetails(roleIds);
            return new User_1.User(user.email, user.password, user.username, user.firstName, user.lastName, user.gender, user.dateOfBirth, user._id, user.profilePic, user.isVerified, user.resetToken, roleDetails).toJson();
        });
    }
    fetchRoleDetails(roleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield roleModel_1.roleModel.find({ _id: { $in: roleIds } });
                const roleDetails = roles.map(role => ({
                    roleId: role._id.toString(),
                    roleName: role.name,
                    permissions: role.permissions // Assuming your RoleModel has a 'permissions' field
                }));
                return roleDetails;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to findByemail', 500);
                }
            }
        });
    }
    addMedicalRecord(userId, fileUrl, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId || !fileUrl || !title || !description) {
                    throw new customError_1.CustomError('All fields are required', 404);
                }
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    throw new customError_1.CustomError('Invalid userId format', 400);
                }
                const newRecord = new userMedicalRecordModel_1.medicalRecordModel({
                    userId,
                    fileUrl,
                    title,
                    description
                });
                // Save the new record to the database
                const savedRecord = yield newRecord.save();
                return savedRecord;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to findByemail', 500);
                }
            }
        });
    }
    getMedicalRecords(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userMedicalRecords = yield userMedicalRecordModel_1.medicalRecordModel.find({ userId });
                return userMedicalRecords;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to findByemail', 500);
                }
            }
        });
    }
}
exports.MongoDbUserDataSource = MongoDbUserDataSource;
