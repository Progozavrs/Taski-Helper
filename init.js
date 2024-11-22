var express = require('express');
var cookieParser = require('cookie-parser');
const path = require('path')


// Создание Express-приложения
var init = express();


init.use(express.json());
init.use(express.urlencoded({ extended: true }));
init.use(cookieParser(process.env.COOKIE_KEY));

init.use(express.static(path.join(__dirname, 'static')));

init.get('/', (req, res) => {
    res.send('Hello World');
})

module.exports = init;