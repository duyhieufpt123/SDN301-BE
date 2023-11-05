const express = require('express');
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, orderController.createOrder);
router.get('/:id', auth, orderController.getOrderById);
router.get('/', auth, orderController.getAllOrders);

module.exports = router;
