import { Router } from 'express';
import { MongoDbPostDataSource } from '../../data1/data-sources/mongodb/mongodb-post-dataSourceImp';
import { PostRepository } from '../../domain1/repositories/post-repository';
import { PostUsecase } from '../../domain1/use-cases/Post-useCaseImpl/Post-UseCase';
import { PostController } from '../controllers/postController';


const  postRouter =  Router();

const PostDataSource  = new  MongoDbPostDataSource() ;
const postRepo = new PostRepository(PostDataSource);
const postUsecase = new PostUsecase(postRepo);
const postController = new PostController(postUsecase);

postRouter.post('/', postController.createPost.bind(postController));

postRouter.get('/', postController.getAllPosts.bind(postController));

postRouter.post('/like', postController.likePost.bind(postController));

postRouter.post('/comment', postController.commentOnPost.bind(postController));

postRouter.post('/comment/reply', postController.replyToComment.bind(postController));

postRouter.post('/report', postController.reportPost.bind(postController));

postRouter.post('/block', postController.blockPost.bind(postController));

postRouter.post('/archive', postController.archivePost.bind(postController));

postRouter.get('/:postId', postController.getPostDetails.bind(postController));

postRouter.get('/tag/:tag', postController.explorePostsByTag.bind(postController));

postRouter.put('/comment/edit', postController.editComment.bind(postController));

postRouter.delete('/comment/delete', postController.deleteComment.bind(postController));

postRouter.put('/comment/reply/edit', postController.editReply.bind(postController));

postRouter.delete('/comment/reply/delete', postController.deleteReply.bind(postController));

export default postRouter;
