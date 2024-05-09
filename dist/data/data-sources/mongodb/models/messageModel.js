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
exports.messageModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true
    },
    senderModel: {
        type: String,
        enum: ['User', 'Doctor'],
        required: true
    },
    content: {
        text: { type: String }, // Define subfields within content as separate properties
        fileUrl: { type: String },
        fileName: { type: String },
        fileSize: { type: Number },
        fileType: { type: String },
    },
    messageType: {
        type: String,
        enum: ['text', 'audio', 'video', 'document'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    meta: [{
            member: {
                type: mongoose_1.Schema.Types.ObjectId,
                refPath: 'meta.memberType'
            },
            memberType: {
                type: String,
                enum: ['User', 'Doctor']
            },
            delivered: {
                type: Boolean,
                default: false,
            },
            read: {
                type: Boolean,
                default: false,
            },
        }]
});
const messageModel = mongoose_1.default.model('message', messageSchema);
exports.messageModel = messageModel;
