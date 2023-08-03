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
router.get('/posts/:page', blogController.getPostPage)

// get page create post
router.get('/create-post', authController.authenUser, blogController.getPageCreatePost)

// create post
router.post('/upload-profile-pic', authController.authenUser, upload.single('profile_pic'), blogController.createPost)

// delete post 
router.post('/dashboard/delete-post/:postId', authController.authenUser, blogController.postDeletePost);

// get dashboard
router.get('/dashboard', authController.authenUser, blogController.getDashboard);

module.exports = router