const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  animalName: {
    type: String,
    required: true,
    unique: true,
  },
  animalSpecies: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  animalSex: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Unknown'],
  },
  animalImage: {
    type: String,
    required: true, 
  },
  habitat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitat',
    required: true,
  }
}, {
  timestamps: true
});

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
