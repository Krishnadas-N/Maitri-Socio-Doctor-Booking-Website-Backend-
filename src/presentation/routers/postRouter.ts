import { Router } from 'express';
import { MongoDbPostDataSource } from '../../data/data-sources/mongodb/mongodb-post-dataSourceImp';
import { PostRepository } from '../../domain/repositories/post-repository';
import { PostUsecase } from '../../domain/use-cases/Post-useCaseImpl/Post-UseCase';
import { PostController } from '../controllers/postController';
import { verifyUserMiddleware } from '../../middlewares/authentication';
import { upload, uploadToCloudinary } from '../../../config/uploadMiddleWare';


const  postRouter =  Router();

const PostDataSource  = new  MongoDbPostDataSource() ;
const postRepo = new PostRepository(PostDataSource);
const postUsecase = new PostUsecase(postRepo);
const postController = new PostController(postUsecase);

postRouter.post('/',verifyUserMiddleware, upload.array('media'),uploadToCloudinary,postController.createPost.bind(postController));

postRouter.get('/',verifyUserMiddleware, postController.getAllPosts.bind(postController));

postRouter.post('/:postId/like', verifyUserMiddleware,postController.likePost.bind(postController));

postRouter.post('/:postId/comment', verifyUserMiddleware,postController.commentOnPost.bind(postController));

postRouter.post('/:postId/comment/reply',verifyUserMiddleware, postController.replyToComment.bind(postController));

postRouter.post('/:postId/report',verifyUserMiddleware, postController.reportPost.bind(postController));

postRouter.post('/block', postController.blockPost.bind(postController));

postRouter.post('/archive', postController.archivePost.bind(postController));

postRouter.get('/:postId', postController.getPostDetails.bind(postController));

postRouter.get('/tag/:tag', postController.explorePostsByTag.bind(postController));

postRouter.put('/comment/edit', postController.editComment.bind(postController));

postRouter.delete('/comment/delete', postController.deleteComment.bind(postController));

postRouter.put('/comment/reply/edit', postController.editReply.bind(postController));

postRouter.delete('/comment/reply/delete', postController.deleteReply.bind(postController));

export default postRouter;
