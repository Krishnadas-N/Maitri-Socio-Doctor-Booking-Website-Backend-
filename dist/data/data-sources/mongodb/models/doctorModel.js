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
exports.doctorModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const passwordUtils_1 = require("../../../../utils/passwordUtils");
const AvailabilitySchema = new mongoose_1.default.Schema({
    dayOfWeek: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: false,
    },
    startTime: String,
    endTime: String,
});
const DoctorSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 50,
        required: true
    },
    password: {
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
        type: Number,
        required: true,
    },
    address: {
        state: String,
        city: String,
        zipcode: Number,
        country: String,
    },
    specialization: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'DoctorCategory',
    },
    education: [
        {
            degree: String,
            institution: String,
            year: String,
        },
    ],
    experience: {
        type: String,
    },
    certifications: {
        type: [String],
    },
    languages: [String],
    consultationFee: [
        {
            type: {
                type: String,
                enum: ['video', 'chat', 'clinic'], // Define the types of consultation
                required: true
            },
            fee: {
                type: Number,
                min: 0,
                required: true
            }
        }
    ],
    availability: [AvailabilitySchema],
    profilePic: String,
    bio: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    followers: [String],
    isVerified: {
        type: Boolean,
        default: false,
    },
    typesOfConsultation: [{
            type: String,
            enum: ['video', 'chat', 'clinic'],
        }],
    maxPatientsPerDay: {
        type: Number,
        default: 10, // Example value, adjust according to your needs
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    resetToken: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    roles: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Role' }],
        default: ['66141503f83ac04df8392561'], // Set the default role(s) here
    },
    registrationStepsCompleted: {
        type: Number,
        required: true,
        default: 0,
        enum: [0, 1, 2, 3]
    },
    selectedSlots: [{
            date: Date,
            slots: [String],
        }]
}, {
    timestamps: true
});
DoctorSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.password && this.isModified('password')) {
            const hasedPassword = yield passwordUtils_1.PasswordUtil.hashPassword(this.password);
            this.password = hasedPassword;
        }
        next();
    });
});
DoctorSchema.index({ firstName: 'text', lastName: 'text', specialization: 'text', bio: 'text' });
const doctorModel = mongoose_1.default.model("Doctor", DoctorSchema);
exports.doctorModel = doctorModel;
