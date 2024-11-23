const multer = require('multer');
const path = require('path');

const maxSize = Number(process.env.FILE_MAXSIZE);

// Проверка файлов на pdf/иное
const fileFilter = function (req, file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Invalid file type, only PDF is allowed!');
    }
}
// Обработка ошибки загрузки Multer-ом
module.exports.errorHandler = function (error, req, res, next) {
    if (error) {
        res.locals.multerError = error;
    }
    else {
        res.locals.multerError = null;
    }
    next()
}
// Конфигурация хранилища для ./static
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('static'));
    },
    filename: function (req, file, cb) {
        // Получаем индекс файла из массива файлов
        const fileIndex = req.files['file'].indexOf(file) + 1;
        cb(null, `${req.body.taskUUID}-${fileIndex}${path.extname(file.originalname)}`);
    }
});
// Настройка Multer загрузчика для pdf файлов
module.exports.fileUploader = multer({
    storage: fileStorage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter
}).fields([
    { name: 'file', maxCount: 5 }
]);