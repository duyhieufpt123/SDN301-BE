const express = require('express');
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const ticketController = require('../controllers/ticketController');
const router = express.Router();

router.get('/', auth, roleCheck('admin'), ticketController.getAllTickets);
router.get('/:id', auth, roleCheck('admin'), ticketController.getTicketById);
router.post('/', auth, roleCheck('admin'), ticketController.createTicket);
router.put('/:id', auth, roleCheck('admin'), ticketController.updateTicket);
router.delete('/:id', auth, roleCheck('admin'), ticketController.deleteTicket);

module.exports = router;
