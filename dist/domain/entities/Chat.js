"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageContent = exports.Message = exports.Conversation = void 0;
class Conversation {
    constructor(members, isGroupChat, groupName, groupDescritption, lastUpdate, isClosed) {
        this.members = members;
        this.isGroupChat = isGroupChat;
        this.groupName = groupName;
        this.groupDescritption = groupDescritption;
        this.lastUpdate = lastUpdate;
        this.isClosed = isClosed;
    }
}
exports.Conversation = Conversation;
class Message {
    constructor(_id, conversationId, senderId, senderModel, // Assuming only two sender models
    content, messageType, createdAt, meta) {
        this._id = _id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderModel = senderModel;
        this.content = content;
        this.messageType = messageType;
        this.createdAt = createdAt;
        this.meta = meta;
    }
}
exports.Message = Message;
// MessageContent Entity
class MessageContent {
    constructor(text, fileUrl, fileName, fileSize, fileType) {
        this.text = text;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
    }
}
exports.MessageContent = MessageContent;
