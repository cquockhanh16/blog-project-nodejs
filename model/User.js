const mongoose = require('mongoose')

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
        maxLength: 10,
        default: "0977062264",
        unique: true,
        required: true
    },
    email: {
        type: String,
        maxLength: 100,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    avatar: {
        type: String,
        required: true
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema);

module.exports = User;