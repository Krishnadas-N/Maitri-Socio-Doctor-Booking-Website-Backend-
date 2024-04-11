import { Router } from 'express';
import { MongoDbPostDataSource } from '../../data/data-sources/mongodb/mongodb-post-dataSourceImp';
import { PostRepository } from '../../domain/repositories/post-repository';
import { PostUsecase } from '../../domain/use-cases/Post-useCaseImpl/Post-UseCase';
import { PostController } from '../controllers/postController';
import { upload, uploadToCloudinary } from '../../../config/uploadMiddleWare';
import { authMiddleWare } from './authRouterSetup';


const  postRouter =  Router();

const PostDataSource  = new  MongoDbPostDataSource() ;
const postRepo = new PostRepository(PostDataSource);
const postUsecase = new PostUsecase(postRepo);
const postController = new PostController(postUsecase);

postRouter.post('/',authMiddleWare.isAuthenticated.bind(authMiddleWare), upload.array('media',5),uploadToCloudinary,postController.createPost.bind(postController));

postRouter.get('/',authMiddleWare.isAuthenticated.bind(authMiddleWare), postController.getAllPosts.bind(postController));

postRouter.post('/:postId/like', authMiddleWare.isAuthenticated.bind(authMiddleWare),postController.likePost.bind(postController));

postRouter.post('/:postId/comment', authMiddleWare.isAuthenticated.bind(authMiddleWare),postController.commentOnPost.bind(postController));

postRouter.post('/:postId/comment/reply',authMiddleWare.isAuthenticated.bind(authMiddleWare), postController.replyToComment.bind(postController));

postRouter.post('/:postId/report',authMiddleWare.isAuthenticated.bind(authMiddleWare), postController.reportPost.bind(postController));

postRouter.post('/block',authMiddleWare.isAuthenticated.bind(authMiddleWare), postController.blockPost.bind(postController));

postRouter.post('/archive', authMiddleWare.isAuthenticated.bind(authMiddleWare),postController.archivePost.bind(postController));

postRouter.get('/:postId',authMiddleWare.isAuthenticated.bind(authMiddleWare), postController.getPostDetails.bind(postController));

postRouter.get('/tag/:tag',authMiddleWare.isAuthenticated.bind(authMiddleWare), postController.explorePostsByTag.bind(postController));

postRouter.put('/comment/edit',authMiddleWare.isAuthenticated.bind(authMiddleWare), postController.editComment.bind(postController));

postRouter.delete('/comment/delete', authMiddleWare.isAuthenticated.bind(authMiddleWare),postController.deleteComment.bind(postController));

postRouter.put('/comment/reply/edit',authMiddleWare.isAuthenticated.bind(authMiddleWare), postController.editReply.bind(postController));

postRouter.delete('/comment/reply/delete',authMiddleWare.isAuthenticated.bind(authMiddleWare), postController.deleteReply.bind(postController));

export default postRouter;
