const express = require('express')
const blogController = require('../controllers/blogController');
const multer = require('multer');
const router = express.Router();
const imageFilter = require('../configs/imageFilter')
const storage = require('../configs/storeImagePost')
const upload = multer({storage: storage, fileFilter: imageFilter})
const authController = require('../controllers/authController')

// get index page
router.get('/', blogController.getAllPost)

// get post for number page
router.get('/posts/page/:page', blogController.getPostPage)

// get page create post
router.get('/create-post', authController.authenUser, blogController.getPageCreatePost)

// create post
router.post('/upload-profile-pic', authController.authenUser, upload.single('post_pic'), blogController.createPost)

// delete post 
router.post('/dashboard/delete-post/:postId', authController.authenUser, blogController.postDeletePost);

// get page edit post 
router.get('/dashboard/edit-post/:postId', authController.authenUser, blogController.getEditPage)

// update post 
router.post('/dashboard/edit-post/:postId', authController.authenUser, upload.single('post_pic'), blogController.postUpdatePost)

// like post
router.post('/like-post', authController.authenUser, blogController.postLikePost)

// get page comment post
router.get('/comment-post', blogController.getCommentPage)

// comment post 
router.post('/comment-post',  authController.authenUser, blogController.postCommentPost)

// share post
router.post('/share-post', authController.authenUser, blogController.postSharePost)

// delete share post
router.post('/dashboard/delete-sharepost', authController.authenUser, blogController.postDeleteSharePost)

// search 
router.get('/results', blogController.searchPost)

// get dashboard
router.get('/dashboard', authController.authenUser, blogController.getDashboard);

// get profile user
router.get('/profile', blogController.getProfileUser)

module.exports = router