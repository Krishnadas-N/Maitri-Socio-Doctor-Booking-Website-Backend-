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
exports.PostUsecase = void 0;
const customError_1 = require("../../utils/customError");
const post_models_1 = require("../../models/post.models");
class PostUsecase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    createPost(doctorId, title, content, media, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(doctorId, title, content, media);
            if (!doctorId) {
                throw new customError_1.CustomError(post_models_1.PostCreationError.MissingDoctorId, 400);
            }
            if (!title) {
                throw new customError_1.CustomError(post_models_1.PostCreationError.MissingTitle, 400);
            }
            if (!content) {
                throw new customError_1.CustomError(post_models_1.PostCreationError.MissingContent, 400);
            }
            if (!Array.isArray(media) || media.some(item => typeof item !== 'object' || typeof item.url !== 'string')) {
                throw new customError_1.CustomError(post_models_1.PostCreationError.InvalidMedia, 400);
            }
            try {
                const post = yield this.postRepository.create({ doctorId, title, content, media, tags });
                return post;
            }
            catch (error) {
                throw new Error(error.message || post_models_1.PostCreationError.CreationFailed);
            }
        });
    }
    getAllPosts(page, limit, userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (page <= 0 || limit <= 0) {
                    throw new customError_1.CustomError('Invalid page or limit value', 400);
                }
                const posts = yield this.postRepository.getAllPosts(page, limit, userId, query);
                // if (!posts || posts.length === 0) {
                //     throw new CustomError('No posts found',404);
                // }
                return posts;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(post_models_1.PostSearchError.SearchFailed, 500);
            }
        });
    }
    likePost(postId, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!postId || !userId) {
                throw new customError_1.CustomError('PostId and UserId are required', 400);
            }
            const updatedPost = yield this.postRepository.likePost(postId, userId, userType);
            return updatedPost;
        });
    }
    commentOnPost(postId, userId, content, userType) {
        if (!postId || !userId || !content) {
            throw new customError_1.CustomError('Invalid postId, userId, or comment content', 400);
        }
        return this.postRepository.commentOnPost(postId, { userId, content, timestamp: new Date(Date.now()), externalModelType: userType });
    }
    replyToComment(postId, commentId, userId, content, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!postId || !commentId || !userId || !content) {
                throw new customError_1.CustomError('Invalid postId, commentId, userId, or content', 400);
            }
            return yield this.postRepository.replyToComment(postId, commentId, { userId, content, timestamp: new Date(Date.now()), externalModelType: userType });
        });
    }
    reportPost(postId, userId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!postId || !userId || !reason) {
                    throw new customError_1.CustomError('Invalid input parameters', 400);
                }
                const reportedPost = yield this.postRepository.reportPost(postId, { userId, reason, timestamp: new Date(Date.now()) });
                if (!reportedPost) {
                    throw new customError_1.CustomError('Post not found', 404);
                }
                return reportedPost;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Internal server error', 500);
                }
            }
        });
    }
    explorePostsByTag(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!tag) {
                    throw new customError_1.CustomError('Tag is required', 400);
                }
                return yield this.postRepository.explorePostsByTag(tag);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError('Failed to explore posts by tag', 500);
                }
            }
        });
    }
    editReply(postId, commentId, replyId, content, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!postId || !commentId || !replyId || !content) {
                    throw new customError_1.CustomError('postId, commentId, replyId, and content are required', 400);
                }
                const updatedReply = yield this.postRepository.editReply(postId, commentId, replyId, content, userType);
                return updatedReply;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to edit reply', 500);
                }
            }
        });
    }
    editComment(postId, commentId, content, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postRepository.editComment(postId, commentId, content, userType);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to edit reply', 500);
                }
            }
        });
    }
    deleteReply(postId, commentId, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!replyId || !commentId || !postId) {
                    throw new Error('Reply ID, Comment ID, and Post ID are required');
                }
                const success = yield this.postRepository.deleteReply(postId, commentId, replyId);
                return success;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to edit reply', 500);
                }
            }
        });
    }
    deleteComment(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!postId || !commentId) {
                    throw new customError_1.CustomError('Post ID and Comment ID are required', 400);
                }
                const deleted = yield this.postRepository.deleteComment(postId, commentId);
                if (!deleted) {
                    throw new customError_1.CustomError('Failed to delete comment', 500);
                }
                return true;
            }
            catch (error) {
                throw new customError_1.CustomError(error.message || 'Error deleting comment:', 500);
            }
        });
    }
    blockPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!postId) {
                    throw new customError_1.CustomError('Post ID is required', 400);
                }
                return yield this.postRepository.blockPost(postId);
            }
            catch (error) {
                throw new customError_1.CustomError(error.message || 'Error deleting comment:', 500);
            }
        });
    }
    archivePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!postId) {
                    throw new customError_1.CustomError('Post ID is required', 400);
                }
                return yield this.postRepository.archivePost(postId);
            }
            catch (error) {
                console.error('Error archiving post:', error);
                throw new customError_1.CustomError(error.message || 'Error archiving post:', 500);
            }
        });
    }
    getDoctorPosts(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(doctorId, ' doctor id');
                if (!doctorId) {
                    throw new customError_1.CustomError('Doctor ID is required', 400);
                }
                return yield this.postRepository.getDoctorUploadedPosts(doctorId);
            }
            catch (error) {
                console.error('Error archiving post:', error);
                throw new customError_1.CustomError(error.message || 'Error archiving post:', 500);
            }
        });
    }
    editPost(doctorId, postId, title, content, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!doctorId) {
                    throw new customError_1.CustomError('Unautorized User', 403);
                }
                return yield this.postRepository.editPost(doctorId, postId, title, content, tags);
            }
            catch (error) {
                console.error('Error archiving post:', error);
                throw new customError_1.CustomError(error.message || 'Error archiving post:', 500);
            }
        });
    }
    findPostById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new Error("postId is missing.");
                }
                const post = yield this.postRepository.findById(id, userId);
                if (!post) {
                    return null;
                }
                return post;
            }
            catch (error) {
                throw new Error(`Failed to fetch post details: ${error.message}`);
            }
        });
    }
    deletePost(doctorId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!postId) {
                    throw new Error("postId is missing.");
                }
                return yield this.postRepository.deletePost(doctorId, postId);
            }
            catch (error) {
                throw new Error(`Failed to fetch post details: ${error.message}`);
            }
        });
    }
}
exports.PostUsecase = PostUsecase;
