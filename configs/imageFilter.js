  // Giới hạn loại file tải lên, trong đây là chỉ chấp nhận file ảnh (jpeg, jpg, png, gif)
  const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

module.exports = imageFilter