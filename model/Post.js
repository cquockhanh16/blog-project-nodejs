const mongoose = require('mongoose')
const User = require('./User')
const dateVietNam = require('../configs/time-zone')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }, 
    avatar: {
        type: String
    },
    createdAt: {
        type: String,
        default: dateVietNam
    },
    updatedAt: {
        type: String,
        default: dateVietNam
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }

})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;

