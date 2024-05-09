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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LikeSchema = new mongoose_1.default.Schema({
    externalModelType: {
        type: String,
        enum: ['User', 'Doctor'],
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'externalModelType', // Dynamic referencing for nested replies
    },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });
const postMediaSchema = new mongoose_1.default.Schema({
    url: {
        type: String,
        trim: true
    }
}, {
    _id: false
});
const ReplySchema = new mongoose_1.default.Schema({
    externalModelType: {
        type: String,
        enum: ['User', 'Doctor'],
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'externalModelType', // Use dynamic referencing based on externalModelType
        required: true
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    replies: [{
            externalModelType: {
                type: String,
                enum: ['User', 'Doctor'],
                required: true
            },
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                refPath: 'externalModelType', // Dynamic referencing for nested replies
                required: true
            },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }]
});
const CommentSchema = new mongoose_1.default.Schema({
    externalModelType: {
        type: String,
        enum: ['User', 'Doctor'],
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'externalModelType', // Use dynamic referencing based on externalModelType
        required: true
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    replies: [ReplySchema]
});
// Report sub-schema
const ReportSchema = new mongoose_1.default.Schema({
    externalModelType: {
        type: String,
        enum: ['User', 'Doctor'],
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'externalModelType', // Dynamic referencing for nested replies
        required: true
    },
    reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const PostSchema = new mongoose_1.default.Schema({
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    media: [postMediaSchema],
    tags: [{
            type: String
        }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [LikeSchema],
    comments: [CommentSchema],
    reportedBy: [ReportSchema],
    isBlocked: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const postModel = mongoose_1.default.model('Post', PostSchema);
exports.postModel = postModel;
