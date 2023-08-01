const multer = require('multer')
const Post = require('../model/Post')


const upload = multer().single('profile_pic')

const getAllPost = async (req, res, next) => {
    const postAll = await Post.find().sort({ _id: -1 }).limit(5);
    const totalPage = await Post.countDocuments();
    //console.log(postAll);
    return res.render('index', {
        path: "/", 
        title: "Home page",
        css: "index.css",
        posts: postAll,
        numberPage: Math.ceil(totalPage/5)
    })
}

const getPostPage = async(req, res, next) => {
    const numberPage = req.params.page;
    const postPage = await Post.find().skip(5*(numberPage-1)).limit(5)
    const totalPage = await Post.countDocuments();
    //console.log(postAll);
    return res.render('index', {
        path: "/", 
        title: "Home page",
        css: "index.css",
        posts: postPage,
        numberPage: Math.ceil(totalPage/5)
    })
}

const getPageCreatePost = (req, res, next) => {
    res.render('create-post', {
        path: 'create-post',
        title: 'Create blog',
        css: "create-post.css"
    })
}

const createPost =  (req, res, next) => {
    let  {title, description} = req.body
     upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        console.log(req.file)
        if (req.fileValidationError) {
            console.log(1)
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            console.log(2)
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            console.log(3)
            return res.send(err);
        }
        // Display uploaded image for user validation
        // res.send(`You have uploaded this image: <hr/><img src="/images/${req.file.filename}" width="500"><hr />`);
        let avatar = req.file.filename;
        const newPost = new Post({
            title: title,
            description: description,
            avatar: avatar
        })
        newPost.save()
            .then(() => {
                return res.redirect('/')
            })
    });
}

module.exports = {
    getAllPost,
    createPost,
    getPageCreatePost,
    getPostPage
}