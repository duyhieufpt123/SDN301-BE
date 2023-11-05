const mongoose = require('mongoose');

const habitatSchema = new mongoose.Schema({
  habitatName: {
    type: String,
    required: true,
    unique: true,
  },
  habitatType: {
    type: String,
    required: true,
  },
  habitatSize: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const Habitat = mongoose.model('Habitat', habitatSchema);

module.exports = Habitat;
