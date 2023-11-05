const express = require('express');
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const accountController = require('../controllers/accountController');
const router = express.Router();

router.post('/register', accountController.register);
router.post('/login', accountController.login);

router.get('/profile', auth, accountController.getProfile);
router.put('/profile', auth, accountController.updateProfile);

router.delete('/:id', auth, roleCheck('admin'), accountController.deleteAccount);
router.get('/all', auth, roleCheck('admin'), accountController.getAllAccounts);

module.exports = router;
