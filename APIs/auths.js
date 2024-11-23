const passport = require("passport");
const YandexStrategy = require("passport-yandex").Strategy;
// const VkontakteStrategy = require('passport-vkontakte').Strategy;

const db = require("../database/index");
const router = require("express").Router();

// Стратегия авторизации через Яндекс
passport.use(new YandexStrategy({
		clientID: process.env.YANDEX_CLIENT_ID,
		clientSecret: process.env.YANDEX_CLIENT_SECRET,
		callbackURL: "https://taski-helper.mooo.com/auth/yandex/callback",
	},
	function (accessToken, refreshToken, profile, done) {
		db.Credentials.findOne({
			where: {
				yandexID: profile.id,
			},
		})
		.then((user) => {
			if (user) {
				return done(null, user.UUID);
			} 
			else {
				db.Credentials.create({
					yandexID: profile.id,
				})
				.then((newUser) => {
					// Создаем профиль с данными из profile пользователя
					db.Profiles.create({
						credentialsUUID: newUser.UUID, // FK на созданного пользователя
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
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
));

// // Стратегия авторизации через ВКонтакте
// passport.use(new VkontakteStrategy({
//     clientID: process.env.VK_CLIENT_ID,
//     clientSecret: process.env.VK_CLIENT_SECRET,
//     callbackURL: "https://taski-helper.mooo.com/auth/vk/callback",
// }, 
// function (accessToken, refreshToken, params, profile, done) {
//     db.Credentials.findOne({
//         where: {
//             vkID: profile.id,
//         },
//     })
//     .then((user) => {
//         if (user) {
//             return done(null, user.UUID);
//         } else {
//             db.Credentials.create({
//                 vkID: profile.id,
//             })
//             .then((newUser) => {
//                 // Создаем профиль с данными из profile пользователя
//                 db.Profiles.create({
//                     credentialsUUID: newUser.UUID, // FK на созданного пользователя
//                     firstName: profile.name.givenName,
//                     lastName: profile.name.familyName,
//                     email: profile.emails[0].value,
//                     photoURL: profile.photos[0].value,
//                 })
//                 .then((newProfile) => {
//                     return done(null, newUser.UUID);
//                 })
//                 .catch((err) => {
//                     return done(err, null);
//                 });
//             })
//             .catch((err) => {
//                 return done(err, null);
//             });
//         }
//     });
// }));

// Сериализация и десериализация пользователя
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

// Авторизация через Яндекс
router.get("/yandex", passport.authenticate("yandex"));

router.get("/yandex/callback", passport.authenticate("yandex", { failureRedirect: "/" }), (req, res) => {
	res.cookie('auth_uuid', req.user, { 
		signed: true, 
		httpOnly: false,
		maxAge: 1000 * Number(process.env.AUTH_LIFETIME),
	});
	res.status(200).redirect(`/profile`);
});

// // Авторизация через ВКонтакте
// router.get("/vk", passport.authenticate("vkontakte"));
// router.get("/vk/callback", passport.authenticate("vkontakte", { failureRedirect: "/" }), (req, res) => {
// 	res.cookie('auth_uuid', req.user, { 
// 		signed: true, 
// 		httpOnly: false,
// 		maxAge: 1000 * Number(process.env.AUTH_LIFETIME),
// 	});
// 	res.status(200).redirect(`/profile`);
// });

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
			res.clearCookie("connect.sid");
			res.clearCookie("auth_uuid");
			res.redirect("/");
		});
	});
});

module.exports.passport = passport;
module.exports.router = router;