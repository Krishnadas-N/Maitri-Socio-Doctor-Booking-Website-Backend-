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
exports.PostController = void 0;
const reponseHandler_1 = require("../../utils/reponseHandler");
const POST_1 = require("../../domain/entities/POST");
const customError_1 = require("../../utils/customError");
const requestValidationMiddleware_1 = require("../../middlewares/requestValidationMiddleware");
class PostController {
    constructor(postUsecase) {
        this.postUsecase = postUsecase;
    }
    createPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = req.user;
            (0, requestValidationMiddleware_1.assertHasUser)(req);
            const doctorId = req.user.id;
            console.log("user", doctor, doctorId);
            const { title, content, tags } = req.body;
            const cloudinaryUrls = req.body.cloudinaryUrls;
            if (cloudinaryUrls.length === 0) {
                console.error('No Cloudinary URLs found.');
                return res.status(500).send('Internal Server Error');
            }
            try {
                if (!cloudinaryUrls || cloudinaryUrls.length === 0) {
                    console.error('No Cloudinary URLs found.');
                    return res.status(400).json({ error: 'No Cloudinary URLs found' });
                }
                const mediaUrls = cloudinaryUrls;
                const mediaObjects = mediaUrls.map(url => new POST_1.Media(url));
                const post = yield this.postUsecase.createPost(doctorId, title, content, mediaObjects, tags);
                (0, reponseHandler_1.sendSuccessResponse)(res, post, "Create a new post successfully");
            }
            catch (error) {
                next(error);
            }
        });
    }
    editPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, requestValidationMiddleware_1.assertHasUser)(req);
            const doctorId = req.user.id;
            console.log("user", doctorId);
            console.log(req.body);
            const { title, content, tags } = req.body;
            const postId = req.params.postId;
            try {
                if (!postId) {
                    throw new customError_1.CustomError("Post Id is not defined", 404);
                }
                const post = yield this.postUsecase.editPost(doctorId, postId, title, content, tags);
                (0, reponseHandler_1.sendSuccessResponse)(res, post, "Create a new post successfully");
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, query } = req.query;
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                const pageNumber = page ? +page : 1;
                const limitNumber = limit ? +limit : 10;
                const posts = yield this.postUsecase.getAllPosts(pageNumber, limitNumber, userId, query);
                (0, reponseHandler_1.sendSuccessResponse)(res, posts, "Post are SuccessFully Retrieved");
            }
            catch (error) {
                next(error);
            }
        });
    }
    likePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userType = req.user.roles[0].roleName;
                const postId = req.params.postId;
                const userId = req.user.id;
                console.log(postId, userId);
                if (!postId || !userId) {
                    throw new customError_1.CustomError('Post ID and User ID are required', 403);
                }
                const post = yield this.postUsecase.likePost(postId, userId, userType);
                if (!post) {
                    throw new customError_1.CustomError('Post not found or unable to like the post', 404);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, post, "Post are SuccessFully Liked");
            }
            catch (error) {
                next(error);
            }
        });
    }
    commentOnPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, requestValidationMiddleware_1.assertHasUser)(req);
            const userType = req.user.roles[0].roleName;
            const postId = req.params.postId;
            const userId = req.user.id;
            const content = req.body.comment;
            console.log(postId, userId, content);
            try {
                if (!postId || !userId || !content) {
                    throw new customError_1.CustomError('Post ID, User ID, and Comment Content are required', 400);
                }
                const post = yield this.postUsecase.commentOnPost(postId, userId, content, userType);
                if (!post) {
                    throw new customError_1.CustomError('Post not found or unable to add comment to the post', 404);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, post, "post are  successfully commented on.");
            }
            catch (error) {
                next(error);
            }
        });
    }
    replyToComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            (0, requestValidationMiddleware_1.assertHasUser)(req);
            const userType = req.user.roles[0].roleName;
            const userId = req.user.id;
            const { commentId, content } = req.body;
            console.log(postId, userId, commentId, content);
            try {
                if (!postId || !commentId || !userId || !content) {
                    throw new customError_1.CustomError('Post ID, Comment ID, User ID, and Content are required', 400);
                }
                const post = yield this.postUsecase.replyToComment(postId, commentId, userId, content, userType);
                if (!post) {
                    throw new customError_1.CustomError('Post not found or unable to add comment to the post', 404);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, post, 'Post is successfully replied on.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    reportPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, userId, reason } = req.body;
            // const userType: userType= req.user.roles[0].roleName;
            try {
                if (!postId || !userId || !reason) {
                    throw new customError_1.CustomError('Post ID, User ID, and Reason are required', 400);
                }
                const post = yield this.postUsecase.reportPost(postId, userId, reason);
                if (!post) {
                    throw new customError_1.CustomError('Post not found or unable to add comment to the post', 404);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, post, 'Post is successfully reported on.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                if (!postId) {
                    throw new customError_1.CustomError('Post ID is required', 400);
                }
                const post = yield this.postUsecase.blockPost(postId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, post, 'Post is successfully blocked on.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    archivePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                if (!postId) {
                    throw new customError_1.CustomError('Post ID is required', 400);
                }
                const post = yield this.postUsecase.archivePost(postId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, post, 'Post is successfully archived on.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPostDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('//////////////////////////////////////////////////////');
            const { postId } = req.params;
            (0, requestValidationMiddleware_1.assertHasUser)(req);
            const userId = req.user.id;
            try {
                if (!postId) {
                    throw new customError_1.CustomError('Post ID is required', 400);
                }
                const post = yield this.postUsecase.findPostById(postId, userId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, post, 'Post Details is successfully reterieved on.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    explorePostsByTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tag } = req.params;
            try {
                if (!tag) {
                    throw new customError_1.CustomError('Tag parameter is required', 400);
                }
                const posts = yield this.postUsecase.explorePostsByTag(tag);
                return (0, reponseHandler_1.sendSuccessResponse)(res, posts, 'Post Details is successfully reterieved on.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    editComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, commentId, content } = req.body;
            (0, requestValidationMiddleware_1.assertHasUser)(req);
            const userType = req.user.roles[0].roleName;
            try {
                if (!postId || !commentId || !content) {
                    throw new customError_1.CustomError('Post ID, Comment ID, and Content are required', 400);
                }
                const comment = yield this.postUsecase.editComment(postId, commentId, content, userType);
                if (!comment) {
                    throw new customError_1.CustomError('Failed to edit comment', 404);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, comment, 'Commented on a Post SuccessFully.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, commentId } = req.body;
            try {
                if (!postId || !commentId) {
                    throw new customError_1.CustomError('Post ID and Comment ID are required', 400);
                }
                const result = yield this.postUsecase.deleteComment(postId, commentId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, result, 'Comment SuccessFully Deleted.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    editReply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, commentId, replyId, content } = req.body;
            (0, requestValidationMiddleware_1.assertHasUser)(req);
            const userType = req.user.roles[0].roleName;
            try {
                if (!postId || !commentId || !replyId || !content) {
                    throw new customError_1.CustomError('Post ID, Comment ID, Reply ID, and Content are required', 400);
                }
                const reply = yield this.postUsecase.editReply(postId, commentId, replyId, content, userType);
                return (0, reponseHandler_1.sendSuccessResponse)(res, reply, 'Reply Edited  SuccessFully Deleted.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteReply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, commentId, replyId } = req.body;
            try {
                if (!postId || !commentId || !replyId) {
                    throw new customError_1.CustomError('Post ID, Comment ID, and Reply ID are required', 400);
                }
                const result = yield this.postUsecase.deleteReply(postId, commentId, replyId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, result, 'Reply Deleted SuccessFully Deleted.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDoctorPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const doctorId = req.user.id;
                console.log("Doctor id ", doctorId);
                const result = yield this.postUsecase.getDoctorPosts(doctorId);
                console.log("Post gets by doctor", result);
                return (0, reponseHandler_1.sendSuccessResponse)(res, result, 'Reply Deleted SuccessFully Deleted.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteDoctorPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const doctorId = req.user.id;
                console.log("Doctor id ", doctorId);
                yield this.postUsecase.deletePost(doctorId, postId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, {}, 'Post Deleted SuccessFully Deleted.');
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.PostController = PostController;
