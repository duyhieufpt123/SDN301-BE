const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {upload} = require('../middleware/multer');
// const multer = require('multer');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });


router.post('/', auth, roleCheck('admin') , upload.single('animalImage'), animalController.createAnimal, animalController.uploadAnimalImage);

router.put('/:id', auth, roleCheck('admin'), animalController.updateAnimal);

router.get('/habitat/:habitatId', auth, roleCheck('admin'), animalController.getAllAnimalsBelongToHabitat);

router.get('/', auth, roleCheck('admin'), animalController.getAllAnimals);
router.get('/:id', auth, roleCheck('admin'), animalController.getAnimalById);
router.delete('/:id', auth, roleCheck('admin'), animalController.deleteAnimal)
// router.post("/upload", )

module.exports = router;
