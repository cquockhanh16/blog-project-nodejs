const multer = require('multer');
const fs = require('fs')
const appRoot = require('app-root-path')
const path = require('path')

const pathImageUser = appRoot + '/public/images/users/';

// Cấu hình multer để lưu trữ file tải lên trong thư mục 'uploads'
const storage = multer.diskStorage({
    destination: async function(req, file, cb) {
        if (!fs.existsSync(pathImageUser)) {
            // Kiểm tra nếu thư mục không tồn tại
            fs.mkdir(pathImageUser, { recursive: true }, (err) => {
                if (err) {
                    console.error('Không thể tạo thư mục:', err);
                  } else {
                    console.log('Thư mục đã được tạo.');
                  }
            })
          }
        cb(null, pathImageUser);
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

module.exports = storage