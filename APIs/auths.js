const passport = require("passport");
const YandexStrategy = require("passport-yandex").Strategy;

const db = require("../database/index");
const router = require("express").Router();

// Стратегия авторизации через Яндекс
passport.use(
  new YandexStrategy(
    {
      clientID: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      callbackURL: "https://taski-helper.mooo.com/auth/yandex/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      db.Credentials.findOne({
        where: {
          yandexID: profile.id,
        },
      }).then((user) => {
        if (user) {
          return done(null, user.UUID);
        } else {
          db.Credentials.create({
            yandexID: profile.id,
          })
            .then((newUser) => {
              // Создаем профиль с данными из profile пользователя
              db.Profiles.create({
                credentialsUUID: newUser.UUID, // FK на созданного пользователя
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                patronymic: profile.name.middleName || "", // Если нет отчества, оставляем пустым
                email: profile.emails[0].value,
                photoURL: profile.photos[0].value,
              })
                .then((newProfile) => {
                  return done(null, newUser.UUID);
                })
                .catch((err) => {
                  return done(err, null);
                });
            })
            .catch((err) => {
              return done(err, null);
            });
        }
      });
    }
  )
);
passport.serializeUser((user, cb) => {
  process.nextTick(function () {
    return cb(null, user);
  });
});
passport.deserializeUser(function (user, cb) {
  db.Credentials.findOne({
    where: {
      UUID: user,
    },
  })
    .then((user) => {
      return cb(null, user.UUID);
    })
    .catch((err) => {
      return cb(err);
    });
});

// Стратегия авторизации через Телеграмм

// Стратегия авторизации через ВКонтакте

// Стратегия авторизации через Телеграмм

// Стратегия авторизации через ВКонтакте

// Авторизация через Яндекс
router.get("/yandex", passport.authenticate("yandex"));

router.get(
  "/yandex/callback",
  passport.authenticate("yandex", {
    failureRedirect: '/',
  }),
  (req, res) => {
    db.Profiles.findOne({
      where: {
        credentialsUUID: req.user,
      },
    })
      .then((profile) => {
        res
          .status(200)
          .redirect(`/profile/${profile.UUID}`);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).redirect('/');
      });
  }
);

// Авторизация через Телеграмм

// Авторизация через ВКонтакте

// Выход из аккаунта
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid"); // Удаление куки
      res.redirect("/");
    });
  });
});

module.exports.passport = passport;
module.exports.router = router;
