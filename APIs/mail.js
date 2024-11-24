const nodemailer = require('nodemailer');

module.exports.transporter = nodemailer.createTransport({
    host: 'mail7.serv00.com',
    port: 587,
    secure: false, // true для 465, false для других портов
    auth: {
        user: 'taski-helper@dielve.serv00.net', // ваш email
        pass: process.env.EMAIL_PASSWORD // ваш пароль
    }
});

module.exports.config = {
    from: '"Taski-Helper Notification" <taski-helper@dielve.serv00.net>'
}