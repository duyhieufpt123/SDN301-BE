const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  totalPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  tickets: [{
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }]
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
