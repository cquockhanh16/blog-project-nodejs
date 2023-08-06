const express = require('express');
const multer = require('multer');
const router = express.Router()
const authController = require('../controllers/authController')
const imageFilter = require('../configs/imageFilter')
const storage = require('../configs/storeImageUser')

const upload = multer({storage: storage, fileFilter: imageFilter})

//get page sign up
router.get('/signup', authController.getPageSignUp);

// sign up
router.post('/signup', upload.single('user_pic'), authController.postSignUp);

// get page login
router.get('/login', authController.getPageLogin);

// login
router.post('/login', authController.postLogin)

//log out
router.get('/logout', authController.getLogOut)

module.exports = router