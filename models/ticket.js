const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value >= 1;
      },
      message: 'ticket price cannot be negative.',
    },
  },
  ticketType: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
