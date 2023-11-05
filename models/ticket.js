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
    required: true
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
