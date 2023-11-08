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
    validate: {
      validator: function (value) {
        return value >= 1;
      },
      message: 'Habitat size cannot be negative.',
    },
  },
  condition: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Habitat = mongoose.model('Habitat', habitatSchema);

module.exports = Habitat;
