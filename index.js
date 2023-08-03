const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
require('dotenv').config()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const session = require('express-session')
const flash = require('express-flash')

const blogRouters = require('./routes/blogRoutes')
const authRoutes = require('./routes/authRouter')

const app = express()
const PORT = process.env.PORT || 2003
const MONGOOSE_URL = process.env.MONGOOSE_URL;

// use express flash
app.use(flash());

// set middleware to use cookie
app.use(cookieParser());

app.use(session({
    secret: 'your-secret-key', // Chuỗi bí mật, có thể là bất kỳ chuỗi nào.
    resave: false, // Có tái lưu phiên sau mỗi yêu cầu hay không? (true/false)
    saveUninitialized: false // Lưu phiên không có dữ liệu hay không? (true/false)
}))

// set folder public
app.use(express.static(path.join(__dirname, 'public')));

// set view engine
app.set('view engine', 'ejs')

// Đặt thư mục chứa các tệp xem (view files)
app.set('views', path.join(__dirname, 'views'));

// app use cors
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// authentication user
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// blog routes
app.use(blogRouters)

// auth routes
app.use(authRoutes)

mongoose.connect(MONGOOSE_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server is running...")
        })
    })
    .catch(err => {
        console.log(err);
    })

