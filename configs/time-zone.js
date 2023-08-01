const moment = require('moment-timezone')

const dateVietNam = moment.tz(Date.now(), "Asia/Ho_Chi_Minh").format('DD/MM/YYYY HH:mm:ss');

module.exports = dateVietNam