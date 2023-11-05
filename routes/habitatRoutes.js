const express = require('express');
const router = express.Router();
const habitatController = require('../controllers/habitatController');
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, roleCheck('admin'), habitatController.getAllHabitats);
router.get('/:id', auth, roleCheck('admin'), habitatController.getHabitatById);
router.post('/', auth, roleCheck('admin'), habitatController.createHabitat);
router.put('/:id', auth, roleCheck('admin'), habitatController.updateHabitat);
router.delete('/:id', auth, roleCheck('admin'), habitatController.deleteHabitat);

module.exports = router;
