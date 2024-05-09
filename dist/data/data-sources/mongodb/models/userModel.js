"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const passwordUtils_1 = require("../../../../utils/passwordUtils");
const userSchema = new mongoose_1.default.Schema({
    profilePic: {
        type: String,
        default: 'https://banner2.cleanpng.com/20180327/ssq/kisspng-computer-icons-user-profile-avatar-profile-5ab9e3b05772c0.6947928615221318883582.jpg'
    },
    firstName: {
        type: String,
        required: true,
        max: 25,
    },
    lastName: {
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
    },
    resetToken: {
        type: String,
    },
    roles: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Role' }],
        default: ['6612457293c66989fc111447'], // Set the default role(s) here
    },
}, { timestamps: true });
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.password && this.isModified('password')) {
            const hasedPassword = yield passwordUtils_1.PasswordUtil.hashPassword(this.password);
            this.password = hasedPassword;
        }
        next();
    });
});
const userModel = mongoose_1.default.model('User', userSchema);
exports.userModel = userModel;
