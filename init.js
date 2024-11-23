const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
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
  origin: ["https://taski-helper.mooo.com", process.env.FRONTEND_URL],
  optionsSuccessStatus: 200,
};
init.use(cors(corsOptions));

// Настройка Express-приложения
init.use(express.json());
init.use(express.urlencoded({ extended: true }));
init.use(cookieParser(process.env.COOKIE_KEY));
init.use(
  session({
    secret: process.env.SESSION_KEY,
    cookie: {
      maxAge: Number(process.env.COOKIE_LIFETIME),
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);
init.use(auths.passport.authenticate("session"));

// Подключение роутера авторизации
init.use("/auth", auths.router);

init.use("/api", mainAPI);

init.use(express.static(path.join(__dirname, "dist")));
init.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

module.exports = init;
