const multer = require('multer')
const bcrypt = require('bcrypt')
const User = require('../model/User')
const upload = multer().single('avatar')

const getPageSignUp = async(req, res, next) => {
    return res.render('signup', {
        title: "Page sign up"
    });
}

const getPageLogin = (req, res, next) => {
    return res.render('login', {
        title: "Page login"
    });
}

const postSignUp = async(req, res, next) => {
    let  {fname, lname, phone, email, password, confirm_password} = req.body
    upload(req, res, async function(err){
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        console.log(req.file)
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
        if(password == confirm_password){
            bcrypt.genSalt(12, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    if(!err){
                        const newUser = new User({
                            first_name: fname,
                            last_name: lname,
                            phone_number: phone,
                            email: email,
                            password: hash,
                            avatar: avatar
                        })
                       newUser.save()
                            .then(() => {
                                return res.redirect('/login')
                            })
                    }
                });
            });
        }else{
            return res.redirect('/');
        }
    });
}

const postLogin = async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email: email})
    const match = await bcrypt.compare(password, user.password);
    if(match) {
        req.session.user = user;
        req.flash('user', req.session.user);
        return res.redirect('/');
    }
    return res.status(404).json('login khong thanh cogn')
}

const getLogOut = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
          console.log('Error destroying session:', err);
        } else {
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }
      });
}

const authenUser = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        return res.redirect('/');
    }
}

module.exports = {
    getPageLogin,
    postSignUp,
    getPageSignUp,
    postLogin,
    getLogOut,
    authenUser,
}