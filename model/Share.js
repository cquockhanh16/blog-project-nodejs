const mongoose = require('mongoose');
const moment = require('moment-timezone')

const shareSchema = new mongoose.Schema({
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

const Share = mongoose.model('Share', shareSchema);

module.exports = Share