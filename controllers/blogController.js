const multer = require('multer')
const Post = require('../model/Post')


const upload = multer().single('profile_pic')

const getAllPost = async (req, res, next) => {
    const postAll = await Post.find().populate({
        path: 'author',
        select: 'first_name last_name avatar'
    }).limit(5);
    const totalPage = await Post.countDocuments();
    console.log(postAll)
    return res.render('index', {
        path: "/", 
        title: "Home page",
        css: "index.css",
        posts: postAll,
        numberPage: Math.ceil(totalPage/5),
        isLogin: req.session.user != undefined ? 1 : 0
    })
}

const getPostPage = async(req, res, next) => {
    const numberPage = req.params.page;
    const postPage = await Post.find().skip(5*(numberPage-1)).limit(5)
    const totalPage = await Post.countDocuments();
    return res.render('index', {
        path: "/", 
        title: "Home page",
        css: "index.css",
        posts: postPage,
        numberPage: Math.ceil(totalPage/5),
        isLogin: req.session.user != undefined ? 1 : 0
    })
    
}

const getPageCreatePost = (req, res, next) => {
    res.render('create-post', {
        path: 'create-post',
        title: 'Create blog',
        css: "create-post.css",
        isLogin: req.session.user != undefined ? 1 : 0
    })
}

const createPost =  (req, res, next) => {
    let  {title, description} = req.body
    const user = req.session.user;
     upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        console.log(req.file)
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        // Display uploaded image for user validation
        // res.send(`You have uploaded this image: <hr/><img src="/images/${req.file.filename}" width="500"><hr />`);
        let avatar = req.file.filename;
        const newPost = new Post({
            title: title,
            description: description,
            avatar: avatar,
            author: user._id
        })
        newPost.save()
            .then(() => {
                return res.redirect('/');
            })
    });
}

const postDeletePost = async(req, res, next) => {
    const postId = req.params.postId;
    await Post.findByIdAndDelete(postId);
    return res.redirect('/dashboard')
}

const getDashboard = async (req, res, next) => {
    const user = req.session.user;
    const posts = await Post.find({author: user._id}).populate({
        path: 'author',
        select: 'avatar first_name last_name'
    })
    return res.render('dashboard', {
        posts: posts,
        title: 'Dashboard',
        css: 'dashboard.css'
    })
}   

module.exports = {
    getAllPost,
    createPost,
    getPageCreatePost,
    getPostPage,
    getDashboard,
    postDeletePost
}