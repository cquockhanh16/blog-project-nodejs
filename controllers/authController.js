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
    try {
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
    } catch (error) {
        return res.satus(500).json(error)
    }
}

const postLogin = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email})
        if(user.isLock <= 3){
            const match = await bcrypt.compare(password, user.password);
            if(match) {
                await User.findByIdAndUpdate(user._id, {
                    isLock: 0
                })
                req.session.user = user;
                req.flash('user', req.session.user);
                return res.redirect('/');
            }else{
                let isLockUser = Number(user.isLock) + 1;
                console.log(isLockUser)
                await User.findByIdAndUpdate(user._id, {
                    isLock: isLockUser
                })
                return res.status(500).json('mat khau khong chinh xac')
            }
        }else{
            return res.status(500).json('Your account was locked!')
        }
    }catch(err){
        return res.status(500).json(err)
    }
}

const getLogOut = (req, res, next) => {
    try{
        req.session.destroy((err) => {
            if (err) {
              console.log('Error destroying session:', err);
            } else {
                res.clearCookie('connect.sid');
                return res.redirect('/');
            }
          });
    }catch(err){
        return res.status(500).json(err)
    }
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