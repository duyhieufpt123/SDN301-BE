const express = require('express');
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const accountController = require('../controllers/accountController');
const router = express.Router();

router.post('/register', accountController.register);
router.post('/login', accountController.login);



// cái nào có auth nghĩa là cái đó cần token 
router.get('/profile', auth, accountController.getProfile);
router.put('/profile', auth, accountController.updateProfile);

//cái nào vừa có auth vừa có rolecheck admin thì kiếm token của admin thì mới làm việc dược
router.delete('/:id', auth, roleCheck('admin'), accountController.deleteAccount);
router.get('/all', auth, roleCheck('admin'), accountController.getAllAccounts);

module.exports = router;
