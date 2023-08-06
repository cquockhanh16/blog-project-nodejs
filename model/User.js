const mongoose = require('mongoose')
const moment = require('moment-timezone')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        default: "0977062264",
    },
    email: {
        type: String,
        maxLength: 100,
        unique: true,
        required: true
    },
    address: {
        type: String,
        default: "Viet Nam",
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    avatar: {
        type: String,
        required: true
    },
    isLock: {
        type: Number,
        default: 0
    },
    sharedPosts: {
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

const User = mongoose.model('User', userSchema);

module.exports = User;