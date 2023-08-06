const mongoose = require('mongoose');
const moment = require('moment-timezone')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        default: 'test comment'
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
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

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment