"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.Media = exports.Comment = exports.Report = exports.Reply = exports.Like = void 0;
class Like {
    constructor(userId, timestamp, externalModelType) {
        this.userId = userId;
        this.timestamp = timestamp;
        this.externalModelType = externalModelType;
    }
}
exports.Like = Like;
class Reply {
    constructor(userId, content, timestamp, replies = [], externalModelType) {
        this.userId = userId;
        this.content = content;
        this.externalModelType = externalModelType;
        this.timestamp = timestamp;
        this.replies = replies;
    }
}
exports.Reply = Reply;
class Report {
    constructor(userId, reason, timestamp = new Date(Date.now())) {
        this.userId = userId;
        this.reason = reason;
        this.timestamp = timestamp;
    }
}
exports.Report = Report;
class Comment {
    constructor(userId, content, timestamp = new Date(), externalModelType) {
        this.userId = userId;
        this.content = content;
        this.timestamp = timestamp;
        this.externalModelType = externalModelType;
    }
}
exports.Comment = Comment;
class Media {
    constructor(url) {
        this.url = url;
    }
}
exports.Media = Media;
class Post {
    constructor(doctorId, title, content, media, tags, createdAt, likes, comments, reportedBy, isBlocked = false, isArchived = false) {
        this.doctorId = doctorId;
        this.title = title;
        this.content = content;
        this.media = media;
        this.tags = tags;
        this.createdAt = createdAt;
        this.likes = likes;
        this.comments = comments;
        this.reportedBy = reportedBy;
        this.isBlocked = isBlocked;
        this.isArchived = isArchived;
    }
}
exports.Post = Post;
