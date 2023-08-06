const mongoose = require('mongoose')
const moment = require('moment-timezone')

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
    author: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    likes:{
        type: Array,
        default: []
    },
    comments: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    timestamps: {
        currentTime: () =>  {
            const currentTimeUTC = new Date();
            const vietnamTime = moment(currentTimeUTC).tz('Asia/Ho_Chi_Minh').toDate();
            //const vietnamTime = new Date(currentTimeUTC.getTime() + 7 * 60 * 60 * 1000);
            return vietnamTime;
        }
    }
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;

