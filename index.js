const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
require('dotenv').config()
const mongoose = require('mongoose')


const blogRouters = require('./routes/blogRoutes')

const app = express()
const PORT = process.env.PORT || 2003
const MONGOOSE_URL = process.env.MONGOOSE_URL;

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

app.use(blogRouters)

mongoose.connect(MONGOOSE_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server is running...")
        })
    })
    .catch(err => {
        console.log(err);
    })

