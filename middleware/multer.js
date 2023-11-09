const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, "animal_" + req.body.animalName + ".jpg");
    }
})

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 * 1024 } });

module.exports = { upload };