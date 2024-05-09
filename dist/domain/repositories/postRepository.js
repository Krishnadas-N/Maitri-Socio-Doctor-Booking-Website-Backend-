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
exports.PostRepository = void 0;
const customError_1 = require("../../utils/customError");
const post_models_1 = require("../../models/post.models");
class PostRepository {
    constructor(postRepoDataScource) {
        this.postRepoDataScource = postRepoDataScource;
    }
    create(post) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!post) {
                throw new Error("Post data is missing.");
            }
            const newPost = yield this.postRepoDataScource.create(post);
            return newPost;
        });
    }
    findById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.postRepoDataScource.findById(id, userId);
                return post;
            }
            catch (error) {
                throw new Error(`Failed to fetch post details: ${error.message}`);
            }
        });
    }
    getAllPosts(page, limit, userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postRepoDataScource.getAllPosts(page, limit, userId, query);
            }
            catch (error) {
                throw new customError_1.CustomError(error.message || post_models_1.PostSearchError.SearchFailed, 500);
            }
        });
    }
    likePost(postId, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postRepoDataScource.likePost(postId, userId, userType);
            }
            catch (error) {
                throw new customError_1.CustomError(error.message || post_models_1.PostSearchError.SearchFailed, 500);
            }
        });
    }
    commentOnPost(postId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postRepoDataScource.commentOnPost(postId, comment);
            }
            catch (error) {
                throw new customError_1.CustomError(error.message || 'Error while Saving Comment On database', 500);
            }
        });
    }
    replyToComment(postId, commentId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!postId || !commentId || !reply || !reply.userId || !reply.content) {
                    throw new Error('Invalid parameters for replying to comment');
                }
                return yield this.postRepoDataScource.replyToComment(postId, commentId, reply);
            }
            catch (error) {
                console.error('Error replying to comment:', error);
                throw new customError_1.CustomError(error.message || 'Error  while saving reply comment on Database', 500);
            }
        });
    }
    reportPost(postId, report) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepoDataScource.reportPost(postId, report);
            // If the post was already reported by this user, we just update their report instead of creating a new one
            // If the post was not reported before -> send notification to admin
        });
    }
    explorePostsByTag(tag) {
        if (!tag) {
            throw new customError_1.CustomError('Tag is required', 400);
        }
        return this.postRepoDataScource.getPostByTag(tag);
    }
    editReply(postId, commentId, replyId, content, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepoDataScource.editReply(postId, commentId, replyId, content, userType);
        });
    }
    editComment(postId, commentId, content, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepoDataScource.editComment(postId, commentId, content, userType);
        });
    }
    deleteReply(postId, commentId, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postRepoDataScource.deleteReply(postId, commentId, replyId);
            return result;
        });
    }
    deleteComment(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postRepoDataScource.deleteComment(postId, commentId);
            return result;
        });
    }
    blockPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockedPost = yield this.postRepoDataScource.blockPost(postId);
            return blockedPost;
        });
    }
    archivePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const archivedPost = yield this.postRepoDataScource.archivePost(postId);
            return archivedPost;
        });
    }
    getDoctorUploadedPosts(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepoDataScource.getDoctorPosts(doctorId);
        });
    }
    editPost(doctorId, postId, title, content, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepoDataScource.editDoctorPost(doctorId, postId, title, content, tags);
        });
    }
    deletePost(doctorId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepoDataScource.deletePost(doctorId, postId);
        });
    }
}
exports.PostRepository = PostRepository;
