const multer = require('multer')
const appRoot = require('app-root-path')
const fs = require('fs');
const User = require('../model/User');
const Post = require('../model/Post')
const Comment = require('../model/Comment')
const Share = require('../model/Share')

const upload = multer().single('post_pic')

const getAllPost = async (req, res, next) => {
    try {
        const postAll = await Post.find().sort({createdAt: -1}).populate({
            path: 'author',
        }).limit(5);
        const totalPage = await Post.countDocuments();
        return res.render('index', {
            path: "/", 
            title: "Home page",
            css: "index.css",
            posts: postAll,
            numberPage: Math.ceil(totalPage/5),
            isLogin: req.session.user != undefined ? 1 : 0
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const getPostPage = async(req, res, next) => {
    try {
        const numberPage = req.params.page;
        const postPage = await Post.find().sort({createdAt: -1}).populate({
            path: 'author',
            select: 'first_name last_name avatar'
        }).skip(5*(numberPage-1)).limit(5)
        const totalPage = await Post.countDocuments();
        return res.render('index', {
            path: "/", 
            title: "Home page",
            css: "index.css",
            posts: postPage,
            numberPage: Math.ceil(totalPage/5),
            isLogin: req.session.user != undefined ? 1 : 0
        })
    } catch (error) {
        return res.status(500).json(error)
    }
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
    try {
        let  {title, description, post_pic} = req.body
        const user = req.session.user;
        upload(req, res, function(err) {
            // req.file contains information of uploaded file
            // req.body contains information of text fields, if there were any
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
                .catch(err => {
                    return res.status(500).json('Create post unseccessfully!');  
                })
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const postDeletePost = async(req, res, next) => {
    try {
        const postId = req.params.postId;
        const postDeleted = await Post.findByIdAndDelete(postId);
        if(postDeleted){
            await Share.deleteMany({postId: postId})
            return res.redirect('/dashboard')
        }else{
            return res.status(500).json("Xoa khong thanh cong");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getEditPage = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(post){
            return res.render('edit-post', {
                title: 'Edit post',
                css: 'create-post.css',
                post: post
            })
        }else{
            return res.redirect('/dashboard')
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

const postUpdatePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        let  {title, description} = req.body;
        const post = await Post.findById(postId);
        const pathImagePost = appRoot + '/public/images/posts/' + post.avatar;
        fs.unlink(pathImagePost, (err) => {
            if(!err){
                upload(req, res, async function(err) {
                    // req.file contains information of uploaded file
                    // req.body contains information of text fields, if there were any
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
                    await Post.findByIdAndUpdate(postId, {
                        title: title,
                        description: description,
                        avatar: avatar
                    });
                    return res.redirect('/dashboard');
                });
            }else{
                return res.status(500).json('update post unsuccessfully!')
            }
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const postLikePost = async(req, res, next) => {
    try {
        const userId = req.session.user._id
        const postId = req.query.id
        const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true });
        if(updatedPost){
            return res.redirect('/')
        }else{
            return res.status(500).json("You don'i like this post, Error for SERVER, sorry")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

const getCommentPage = async (req, res, next) => {
    try {
        const postId = req.query.id
        const post = await Post.findById(postId).populate({path: 'author'})
        const comments = await Comment.find({postId: postId}).sort({ createdAt : -1 }).populate({path: 'authorId'})
        return res.render('comment-post', {
            path: "/", 
            title: "Home page",
            css: "index.css",
            post: post,
            comments: comments
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const postCommentPost = async(req, res, next) => {
    try {
        const postId = req.query.id
        const authorId = req.session.user._id
        const {comment} = req.body
        const newComment = new Comment({
            content: comment,
            authorId: authorId,
            postId: postId
        })
        await newComment.save()
            .then(async() => {
                await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } }, { new: true })
                return res.redirect('/')
            })
            .catch(err => {
                return res.status(500).json("Write comment unsuccessfully")
            })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const postSharePost = async(req, res, next) => {
    try {
        const postId = req.query.id;
        const userId = req.session.user._id
        await Post.findByIdAndUpdate(postId,{ $inc: { shares: 1 } }, { new: true })
        const share = new Share({
            authorId: userId,
            postId: postId
        })
        await share.save().then(user => {
            return res.redirect('/dashboard')
        })
        .catch(err => {
            return res.status(500).json(err)
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const postDeleteSharePost = async(req, res, next) => {
    try {
        const sharePostId = req.query.id
        const sharePost = await Share.findByIdAndDelete(sharePostId)
        if(sharePost){
           return res.redirect('/dashboard') 
        }else{
            return res.status(500).json("Deleted share post unsuccessfully!!")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

const getDashboard = async (req, res, next) => {
    try {
        const user = req.session.user
        const posts = await Post.find({author: user._id}).sort({ createdAt : -1 })
        const sharePosts = await Share.find({authorId: user._id}).sort({ createdAt : -1 }).populate({
            path: 'postId',
            populate: {
                path: 'author',
                model: 'User',
            }
        })
        console.log(posts, sharePosts)
        return res.render('dashboard', {
            posts: posts,
            sharePosts: sharePosts,
            author: user,
            title: 'Dashboard',
            css: 'dashboard.css',
            isShowBtn: true
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}  

const getProfileUser = async(req, res, next) => {
    const userId = req.query.id;
    if(req.session.user){
        if(userId == req.session.user._id){
            console.log(req.session.user._id, userId);
            return res.redirect('/dashboard')
        }
    }
        const user = await User.findById(userId)
        const posts = await Post.find({author: userId}).sort({ createdAt : -1 }).populate({path: 'author'})
        const sharePosts = await Share.find({authorId: userId}).sort({ createdAt : -1 }).populate({
            path: 'postId',
            populate: {
                path: 'author',
                model: 'User',
                select: 'first_name last_name avatar'
            }
        })
        console.log(user, posts, sharePosts)
        if(posts && sharePosts){
            return res.render('dashboard', {
                posts: posts,
                sharePosts: sharePosts,
                title: 'Dashboard',
                author: user,
                css: 'dashboard.css',
                isShowBtn: false
            })}else if(!posts && sharePosts){
                return res.render('dashboard', {
                    posts: [],
                    sharePosts: sharePosts,
                    title: 'Dashboard',
                    author: user,
                    css: 'dashboard.css',
                    isShowBtn: false
                })
            }else if(posts && !sharePosts){
                return res.render('dashboard', {
                    posts: posts,
                    sharePosts: [],
                    author: user,
                    title: 'Dashboard',
                    css: 'dashboard.css',
                    isShowBtn: false
                })
            }
            else{
                return res.render('dashboard', {
                    posts: [],
                    sharePosts: [],
                    author: user,
                    title: 'Dashboard',
                    css: 'dashboard.css',
                    isShowBtn: false
                })
            }           
}

const searchPost = async(req, res, next) => {
    try {
        const {seacrh_query, select} = req.query;
        if(select == 1){
            const posts = await Post.find({ title: { $regex: seacrh_query, $options: 'i' } }).sort({createdAt: -1}).populate({
                path: 'author',
            }).limit(5);
            return res.render('index', {
                path: "/", 
                title: "Home page",
                css: "index.css",
                posts: posts,
                numberPage: false
            })
        }else if(select == 0){
            const users = await User.find({ last_name: { $regex: seacrh_query, $options: 'i' } }).sort({createdAt: -1}).limit(5);
            return res.render('search-user', {
                path: "/", 
                title: "Search page",
                css: "index.css",
                users: users,
                numberPage: false
            })
        }else{
            return res.redirect('/')
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = {
    getAllPost,
    createPost,
    getPageCreatePost,
    getPostPage,
    getDashboard,
    postDeletePost,
    getEditPage,
    postUpdatePost,
    postLikePost,
    getCommentPage,
    postCommentPost,
    postSharePost,
    postDeleteSharePost,
    getProfileUser,
    searchPost
}