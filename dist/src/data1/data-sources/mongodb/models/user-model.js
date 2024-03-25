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
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PasswordUtils_1 = require("../../../../../utils/PasswordUtils");
const userSchema = new mongoose_1.default.Schema({
    profilePic: {
        type: String,
        default: 'https://banner2.cleanpng.com/20180327/ssq/kisspng-computer-icons-user-profile-avatar-profile-5ab9e3b05772c0.6947928615221318883582.jpg'
    },
    firstname: {
        type: String,
        required: true,
        max: 25,
    },
    lastname: {
        type: String,
        required: true,
        max: 25,
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        max: 25,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    }, role: {
        type: String,
        required: true,
        default: "0x01",
    },
    dateOfBirth: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.password && this.isModified('password')) {
            const hasedPassword = yield PasswordUtils_1.PasswordUtil.HashPassword(this.password);
            this.password = hasedPassword;
        }
        next();
    });
});
exports.UserModel = mongoose_1.default.model('User', userSchema);
