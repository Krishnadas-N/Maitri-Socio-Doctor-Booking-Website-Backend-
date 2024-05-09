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
exports.MongoDbPostDataSource = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postModel_1 = require("./models/postModel");
const customError_1 = require("../../../utils/customError");
const userModel_1 = require("./models/userModel");
const doctorModel_1 = require("./models/doctorModel");
class MongoDbPostDataSource {
    constructor() { }
    getAllhPosts(page, limit, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const baseMatch = {
                isBlocked: false,
            };
            const aggregationPipeline = [];
            aggregationPipeline.push({ $match: baseMatch });
            const doctorLookupPipeline = [
                {
                    $lookup: {
                        from: 'doctors', // Replace with your doctor collection name
                        localField: 'doctorId',
                        foreignField: '_id',
                        as: 'doctor'
                    }
                },
                {
                    $unwind: '$doctor' // Flatten the doctor array (optional if you want an array of doctors)
                },
                // Optionally uncomment to filter doctors
                // {
                //   $match: {
                //     'doctor.isProfileComplete': true
                //   }
                // },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        content: 1,
                        createdAt: 1,
                        tags: 1,
                        media: 1,
                        likes: 1,
                        comments: 1, // Include comments field for population
                        reportedBy: 1,
                        isBlocked: 1,
                        isArchived: 1,
                        doctorName: '$doctor.firstName', // Include doctor's name
                        doctorProfileImage: '$doctor.profilePic'
                    }
                }
            ];
            const commentPopulationPipeline = [
                {
                    $lookup: {
                        from: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ['$comments.externalModelType', 'User'] },
                                        then: 'users'
                                    },
                                    {
                                        case: { $eq: ['$comments.externalModelType', 'Doctor'] },
                                        then: 'doctors'
                                    },
                                    // Add more cases if needed
                                ],
                                default: 'fallbackCollection' // Specify a fallback collection if none of the conditions match
                            }
                        },
                        localField: 'comments.userId',
                        foreignField: '_id',
                        as: 'comments.author'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        content: 1,
                        createdAt: 1,
                        tags: 1,
                        media: 1,
                        likes: 1,
                        comments: {
                            _id: 1, // Include relevant comment fields
                            content: 1,
                            timestamp: 1,
                            author: {
                                _id: 1,
                                // User/doctor specific fields (e.g., name, profile picture)
                            }
                        },
                        reportedBy: 1,
                        isBlocked: 1,
                        isArchived: 1,
                        doctorName: '$doctor.firstName', // Include doctor's name (assuming a doctor lookup is still needed)
                        doctorProfileImage: '$doctor.profilePic'
                    }
                }
            ];
            // Choose which pipeline to use based on doctor lookup requirement:
            aggregationPipeline.push(...(doctorLookupPipeline ? doctorLookupPipeline : []));
            aggregationPipeline.push(...commentPopulationPipeline);
            if (query) {
                const textSearchPipeline = [
                    {
                        $search: {
                            text: {
                                query,
                                path: ['title', 'content']
                            }
                        }
                    }
                ];
                aggregationPipeline.push({
                    $unionWith: {
                        coll: 'posts',
                        pipeline: [...textSearchPipeline]
                    }
                });
            }
            const posts = yield postModel_1.postModel.aggregate(aggregationPipeline)
                .skip(skip)
                .limit(limit)
                .exec();
            // You can optionally log the posts and their JSON string for debugging purposes
            console.log(posts, JSON.stringify(posts));
            return posts;
        });
    }
    getAllPosts(page, limit, userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const skip = (page - 1) * limit;
            const baseMatch = {
                isBlocked: false,
            };
            let postsQuery = postModel_1.postModel.find(baseMatch)
                .skip(skip)
                .limit(limit);
            if (query) {
                postsQuery = postsQuery.find({ $text: { $search: query } });
            }
            const posts = yield postsQuery.exec();
            const postsResponse = [];
            // Populate doctorId for each post
            yield postModel_1.postModel.populate(posts, { path: 'doctorId', select: 'firstName profilePic' });
            // Populate user and doctor data for comments and replies
            for (const post of posts) {
                if (post.comments && post.comments.length > 0) {
                    for (const comment of post.comments) {
                        let userModel;
                        if (comment.externalModelType === 'User') {
                            userModel = 'User';
                        }
                        else if (comment.externalModelType === 'Doctor') {
                            userModel = 'Doctor';
                        }
                        if (userModel) {
                            yield postModel_1.postModel.populate(comment, { path: 'userId', model: userModel, select: '_id firstName lastName profilePic' });
                        }
                        // Populate replies for each comment
                        if (comment.replies && comment.replies.length > 0) {
                            for (const reply of comment.replies) {
                                const replyModel = reply.externalModelType === 'User' ? 'User' : 'Doctor';
                                yield postModel_1.postModel.populate(reply, { path: 'userId', model: replyModel, select: '_id firstName lastName profilePic' });
                            }
                        }
                    }
                }
                const isLikedByUser = (_a = post.likes) === null || _a === void 0 ? void 0 : _a.some(like => like.userId.toString() === userId.toString());
                const isPermissionToCrud = post.doctorId && typeof post.doctorId === 'object' && post.doctorId._id.toString() === userId.toString();
                console.log(isPermissionToCrud, post.doctorId);
                postsResponse.push({
                    post: post,
                    isLikedUser: !!isLikedByUser, // Convert to boolean
                    isPermissionToCrud: isPermissionToCrud
                });
                console.log(post.isLikedByUser);
            }
            // Log posts and their JSON string for debugging purposes
            console.log(postsResponse, JSON.stringify(postsResponse));
            return postsResponse;
        });
    }
    create(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = yield postModel_1.postModel.create(post);
            return newPost;
        });
    }
    findById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new customError_1.CustomError('Invalid Post Id', 400);
            }
            let postsResponse;
            const post = yield postModel_1.postModel.findById(id).populate({ path: 'doctorId', select: 'firstName profilePic' });
            if (!post) {
                throw new customError_1.CustomError('No Post Found in this Id', 404);
            }
            if (post.comments && post.comments.length > 0) {
                for (const comment of post.comments) {
                    let userModel;
                    if (comment.externalModelType === 'User') {
                        userModel = 'User';
                    }
                    else if (comment.externalModelType === 'Doctor') {
                        userModel = 'Doctor';
                    }
                    if (userModel) {
                        yield postModel_1.postModel.populate(comment, { path: 'userId', model: userModel, select: '_id firstName lastName profilePic' });
                    }
                    // Populate replies for each comment
                    if (comment.replies && comment.replies.length > 0) {
                        for (const reply of comment.replies) {
                            const replyModel = reply.externalModelType === 'User' ? 'User' : 'Doctor';
                            yield postModel_1.postModel.populate(reply, { path: 'userId', model: replyModel, select: '_id firstName lastName profilePic' });
                        }
                    }
                }
            }
            const isLikedByUser = (_a = post.likes) === null || _a === void 0 ? void 0 : _a.some(like => like.userId.toString() === userId.toString());
            const isPermissionToCrud = post.doctorId && typeof post.doctorId === 'object' && post.doctorId._id.toString() === userId.toString();
            console.log(isPermissionToCrud, post.doctorId);
            postsResponse = {
                post: post,
                isLikedUser: !!isLikedByUser, // Convert to boolean
                isPermissionToCrud: isPermissionToCrud
            };
            console.log(post.isLikedByUser);
            console.log(postsResponse, JSON.stringify(postsResponse));
            return postsResponse;
        });
    }
    likePost(postId, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!mongoose_1.default.Types.ObjectId.isValid(postId) || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
                throw new customError_1.CustomError('Invalid Post Id or User Id', 400);
            }
            const post = yield postModel_1.postModel.findById(postId);
            console.log("Log from like post after finding the post for like", post);
            if (!post) {
                throw new customError_1.CustomError('Post not found', 404);
            }
            console.log(post.likes);
            const likedIndex = (_a = post.likes) === null || _a === void 0 ? void 0 : _a.findIndex(like => like.userId.toString() === userId.toString());
            console.log(likedIndex, "Log from liked post index");
            if (likedIndex === undefined || likedIndex === -1) {
                (_b = post.likes) === null || _b === void 0 ? void 0 : _b.push({ externalModelType: userType, userId, timestamp: new Date() });
            }
            else {
                (_c = post.likes) === null || _c === void 0 ? void 0 : _c.splice(likedIndex, 1);
            }
            return yield post.save();
        });
    }
    commentOnPost(postId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(comment);
            if (!postId || !comment || !comment.userId || !comment.content || !comment.externalModelType) {
                throw new customError_1.CustomError('Invalid postId, userId, model or comment content', 400);
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
                throw new customError_1.CustomError('Invalid Post Id', 400);
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(comment.userId)) {
                throw new customError_1.CustomError('Invalid User Id', 400);
            }
            const post = yield postModel_1.postModel.findById(postId);
            if (!post) {
                throw new customError_1.CustomError('Post not found', 404);
            }
            if (!post.comments) {
                post.comments = [];
            }
            post.comments.push(comment);
            const updatedPost = yield post.save();
            const newComment = updatedPost && updatedPost.comments && updatedPost.comments.length > 0 ? updatedPost.comments[updatedPost.comments.length - 1] : null;
            if (newComment) {
                const userObject = newComment.externalModelType === 'User'
                    ? yield userModel_1.userModel.findById(comment.userId, { _id: 1, firstName: 1, lastName: 1, profilePic: 1 })
                    : yield doctorModel_1.doctorModel.findById(comment.userId, { _id: 1, firstName: 1, lastName: 1, profilePic: 1 });
                newComment.userId = userObject;
            }
            return newComment;
        });
    }
    replyToComment(postId, commentId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(postId, commentId, reply);
            if (!mongoose_1.default.Types.ObjectId.isValid(postId) || !mongoose_1.default.Types.ObjectId.isValid(commentId) || !mongoose_1.default.Types.ObjectId.isValid(reply.userId)) {
                throw new customError_1.CustomError('Invalid Post Id', 400);
            }
            const post = yield postModel_1.postModel.findById(postId);
            if (!post) {
                throw new customError_1.CustomError("Post Not Found ", 404);
            }
            console.log(post);
            const comment = (_a = post.comments) === null || _a === void 0 ? void 0 : _a.find(c => { var _a; return ((_a = c === null || c === void 0 ? void 0 : c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId.toString(); });
            if (!comment) {
                throw new customError_1.CustomError('Comment not found', 404);
            }
            (_b = comment.replies) === null || _b === void 0 ? void 0 : _b.push(reply);
            yield post.save();
            const lastReply = comment.replies && comment.replies.length > 0 ? comment.replies[comment.replies.length - 1] : null;
            console.log(comment.replies, "this is the replie", lastReply);
            if (lastReply) {
                lastReply.userId = lastReply.externalModelType === 'User'
                    ? yield userModel_1.userModel.findById(lastReply.userId, { _id: 1, firstName: 1, lastName: 1, profilePic: 1 })
                    : yield doctorModel_1.doctorModel.findById(lastReply.userId, { _id: 1, firstName: 1, lastName: 1, profilePic: 1 });
            }
            return lastReply;
        });
    }
    reportPost(postId, report) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!mongoose_1.default.Types.ObjectId.isValid(postId) || !mongoose_1.default.Types.ObjectId.isValid(report.userId)) {
                throw new customError_1.CustomError('Invalid Post Id and User ID ', 400);
            }
            if (!report.userId || !report.reason) {
                throw new customError_1.CustomError('Invalid report data. User ID and reason are required.', 400);
            }
            const post = yield postModel_1.postModel.findById(postId);
            if (!post) {
                throw new customError_1.CustomError('Post not found', 404);
            }
            const existingReport = (_a = post.reportedBy) === null || _a === void 0 ? void 0 : _a.find(r => r.userId === report.userId);
            if (existingReport) {
                throw new customError_1.CustomError('Post already reported by this user', 400);
            }
            (_b = post.reportedBy) === null || _b === void 0 ? void 0 : _b.push(report);
            const updatedPost = yield post.save();
            return updatedPost;
        });
    }
    getPostByTag(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postModel_1.postModel.find({ tags: tag });
        });
    }
    editReply(postId, commentId, replyId, content, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!postId || !commentId || !replyId || !content) {
                throw new customError_1.CustomError('postId, commentId, replyId, and content are required', 400);
            }
            console.log(userType);
            const post = yield postModel_1.postModel.findById(postId);
            if (!post) {
                throw new customError_1.CustomError('Post not found', 404);
            }
            const comment = (_a = post.comments) === null || _a === void 0 ? void 0 : _a.find((comment) => comment._id.equals(commentId));
            if (!comment) {
                throw new customError_1.CustomError('Comment not found', 404);
            }
            const reply = (_b = comment.replies) === null || _b === void 0 ? void 0 : _b.find((reply) => reply._id.equals(replyId));
            if (!reply) {
                throw new customError_1.CustomError('Reply not found', 404);
            }
            reply.content = content;
            yield post.save();
            return reply;
        });
    }
    editComment(postId, commentId, content, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!mongoose_1.default.Types.ObjectId.isValid(postId) || !mongoose_1.default.Types.ObjectId.isValid(commentId)) {
                throw new customError_1.CustomError('Invalid postId or commentId', 400);
            }
            console.log(userType);
            const post = yield postModel_1.postModel.findById(postId);
            if (!post) {
                throw new customError_1.CustomError('Post not found', 404);
            }
            const comment = (_a = post.comments) === null || _a === void 0 ? void 0 : _a.find((comment) => comment._id.equals(commentId));
            if (!comment) {
                throw new customError_1.CustomError('Comment not found', 404);
            }
            comment.content = content;
            yield post.save();
            return comment;
        });
    }
    deleteComment(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!mongoose_1.default.Types.ObjectId.isValid(postId) || !mongoose_1.default.Types.ObjectId.isValid(commentId)) {
                throw new customError_1.CustomError('Invalid postId or commentId', 400);
            }
            const post = yield postModel_1.postModel.findById(postId);
            if (!post) {
                console.error('Post not found');
                return false;
            }
            const commentIndex = (_a = post.comments) === null || _a === void 0 ? void 0 : _a.findIndex((comment) => comment._id.toString() === commentId.toString());
            if (commentIndex === undefined || commentIndex === -1) {
                console.error('Comment not found');
                return false;
            }
            (_b = post.comments) === null || _b === void 0 ? void 0 : _b.splice(commentIndex, 1);
            yield post.save();
            return true;
        });
    }
    deleteReply(postId, commentId, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!mongoose_1.default.Types.ObjectId.isValid(postId) || !mongoose_1.default.Types.ObjectId.isValid(commentId)) {
                throw new customError_1.CustomError('Invalid postId or commentId', 400);
            }
            const post = yield postModel_1.postModel.findById(postId);
            if (!post) {
                console.error('Post not found');
                return false;
            }
            const comment = (_a = post.comments) === null || _a === void 0 ? void 0 : _a.find((comment) => comment._id.toString() === commentId.toString());
            if (!comment) {
                console.error('Comment not found');
                return false;
            }
            const replyIndex = (_b = comment.replies) === null || _b === void 0 ? void 0 : _b.findIndex((reply) => reply._id.toString() === replyId.toString());
            if (!replyIndex || replyIndex === -1) {
                console.error('Reply not found');
                return false;
            }
            (_c = comment.replies) === null || _c === void 0 ? void 0 : _c.splice(replyIndex, 1);
            yield post.save();
            return true;
        });
    }
    archivePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
                throw new Error('Invalid postId');
            }
            const archivedPost = yield postModel_1.postModel.findByIdAndUpdate(postId, { archived: true }, { new: true });
            return archivedPost;
        });
    }
    blockPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
                throw new Error('Invalid postId');
            }
            const blockedPost = yield postModel_1.postModel.findByIdAndUpdate(postId, { blocked: true }, { new: true });
            return blockedPost;
        });
    }
    getDoctorPosts(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(doctorId, '///////////////');
            if (!mongoose_1.default.Types.ObjectId.isValid(doctorId)) {
                throw new Error('Invalid doctorId');
            }
            const posts = yield postModel_1.postModel.aggregate([
                {
                    $match: { "doctorId": new mongoose_1.default.Types.ObjectId(doctorId) }
                },
                {
                    $lookup: {
                        from: 'doctors',
                        localField: 'doctorId',
                        foreignField: '_id',
                        as: 'doctor'
                    }
                },
                {
                    $unwind: '$doctor'
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        content: 1,
                        createdAt: 1,
                        tags: 1,
                        media: 1,
                        likes: 1,
                        comments: 1,
                        reportedBy: 1,
                        isBlocked: 1,
                        isArchived: 1,
                        doctorName: '$doctor.firstName',
                        doctorProfileImage: '$doctor.profilePic',
                        doctorLocation: '$doctor.address'
                    }
                }
            ]);
            console.log(posts, '///12132112121///');
            return posts;
        });
    }
    editDoctorPost(doctorId, postId, title, content, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(doctorId) || !mongoose_1.default.Types.ObjectId.isValid(postId)) {
                    throw new customError_1.CustomError('Invalid doctorId or postId', 400);
                }
                const updatedPost = yield postModel_1.postModel.findOneAndUpdate({ _id: postId, doctorId }, { title, content, tags }, { new: true });
                if (!updatedPost) {
                    throw new customError_1.CustomError('Post not found', 404);
                }
                return {
                    title: updatedPost.title,
                    content: updatedPost.content,
                    tags: updatedPost.tags && ((_a = updatedPost.tags) === null || _a === void 0 ? void 0 : _a.length) > 0 ? updatedPost.tags : [],
                };
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError('Error editing the post: ' + err.message, 500);
                }
            }
        });
    }
    deletePost(doctorId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
                    throw new customError_1.CustomError('Invalid  postId', 400);
                }
                const result = yield postModel_1.postModel.findOneAndDelete({ _id: postId, doctorId });
                if (!result) {
                    throw new customError_1.CustomError('Unauthorized User of Post not Found', 403);
                }
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError('Error editing the post: ' + err.message, 500);
                }
            }
        });
    }
}
exports.MongoDbPostDataSource = MongoDbPostDataSource;
