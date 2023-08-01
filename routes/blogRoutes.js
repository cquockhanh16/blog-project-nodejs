const express = require('express')
const appRoot = require('app-root-path')
const path = require('path')
const blogController = require('../controllers/blogController');
const multer = require('multer');


// Cấu hình multer để lưu trữ file tải lên trong thư mục 'uploads'
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, appRoot + '/public/images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
  // Giới hạn loại file tải lên, trong đây là chỉ chấp nhận file ảnh (jpeg, jpg, png, gif)
  const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const router = express.Router();

const upload = multer({storage: storage, fileFilter: imageFilter})

router.get('/', blogController.getAllPost)

router.get('/posts/:page', blogController.getPostPage)

router.get('/create-post', blogController.getPageCreatePost)

router.post('/upload-profile-pic', upload.single('profile_pic'), blogController.createPost)

module.exports = router