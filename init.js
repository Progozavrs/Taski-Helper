const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
require("dotenv").config();

// Роутер авторизации
const auths = require("./APIs/auths");
// Роутер API
const mainAPI = require("./APIs/mainAPI");

// Создание Express-приложения
const init = express();

// Настройка сессий в MongoDB
const store = new MongoDBStore({
  uri: `mongodb://mo6248_taski:${process.env.MONGODB_PASSWORD}@mongo7.serv00.com:27017/mo6248_taski`,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

// Настройка cors политики
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
init.use(cors(corsOptions));

// Настройка Express-приложения
init.use(express.json());
init.use(express.urlencoded({ extended: true }));
init.use(bodyParser.urlencoded({ extended: true }));
init.use(cookieParser(process.env.COOKIE_KEY));
init.use(session({
    secret: process.env.SESSION_KEY,
    cookie: {
        maxAge: 1000 * Number(process.env.AUTH_LIFETIME),
        secure: true,
    },
    store: store,
    resave: true,
    saveUninitialized: true,
}));
init.use(auths.passport.initialize());
init.use(auths.passport.authenticate("session"));

// Подключение роутера авторизации
init.use("/auth", auths.router);

// Извлечение UUID пользователя в res.locals.UUID
init.use((req, res, next) => {
    res.locals.UUID = req.signedCookies['auth_uuid'];
    next();
})

// Подключение роутера API
init.use("/api", mainAPI);

// Подключение SPA
init.use(express.static(path.join(__dirname, "dist")));
init.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

module.exports = init;
