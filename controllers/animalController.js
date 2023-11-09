const { path } = require('../app');
const Animal = require('../models/animal');
const Habitat = require('../models/habitat');
const multer = require('multer');
const fs = require('fs')

const findById = async (req) => {
  const id = req.query.id
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, "animal_" + findById + ".jpg");
  },
});

const upload = multer({ storage });


const createAnimal = async (req, res) => {
  try {
    const habitat = await Habitat.findById(req.body.habitat);
    if (!habitat) {
      return res.status(404).send({ message: 'Habitat not found' });
    }
    const duplicateAnimal = await Animal.findOne({ animalName: req.body.animalName });
    if (duplicateAnimal) {
      return res.status(409).send({ message: 'An animal with this name already exists.' });
    }

    const animal = new Animal({
      ...req.body,
      animalImage: req.file ? req.file.path : undefined,
    });

    await animal.save();
    res.status(201).send(animal);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateAnimal = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['animalName', 'animalSpecies', 'dateOfBirth', 'animalSex', 'animalImage', 'habitat'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).send();
    }
    updates.forEach((update) => animal[update] = req.body[update]);
    if (req.file) {
      animal.animalImage = req.file.path;
    }
    await animal.save();
    res.send(animal);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({}).populate('habitat', 'habitatName habitatType habitatSize condition -_id');
    const result = animals.map(animal => ({
      animalid: animal._id,
      animalName: animal.animalName,
      animalSpecies: animal.animalSpecies,
      dateOfBirth: animal.dateOfBirth,
      animalSex: animal.animalSex,
      animalImage: animal.animalImage,
      habitat: animal.habitat
    }));
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAnimalById = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id).populate('habitat', 'habitatName habitatType habitatSize condition -_id');
    if (!animal) {
      return res.status(404).send({ message: 'Animal not found' });
    }
    const result = {
      animalid: animal._id,
      animalName: animal.animalName,
      animalSpecies: animal.animalSpecies,
      dateOfBirth: animal.dateOfBirth,
      animalSex: animal.animalSex,
      animalImage: animal.animalImage,
      habitat: animal.habitat
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllAnimalsBelongToHabitat = async (req, res) => {
  try {
    const habitatId = req.params.habitatId;
    const habitat = await Habitat.findById(habitatId, 'habitatName habitatType condition -_id');

    if (!habitat) {
      return res.status(404).send({ message: 'Habitat not found' });
    }

    const animals = await Animal.find({ habitat: habitatId }, '_id animalName animalSpecies dateOfBirth animalSex animalImage');

    const result = {
      habitat: {
        habitatName: habitat.habitatName,
        habitatType: habitat.habitatType,
        condition: habitat.condition,
        animals: animals.map(animal => ({
          animalid: animal._id,
          animalName: animal.animalName,
          animalSpecies: animal.animalSpecies,
          animalImage: animal.animalImage,
          dateOfBirth: animal.dateOfBirth,
          animalSex: animal.animalSex
        }))
      }
    };

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) {
      return res.status(404).send({ message: 'Animal not found' });
    }
    res.status(200).send({ message: 'Animal deleted successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

const viewImage = async (req, res) => {
  try {
    const id = req.params.id
    const imagePath = path
      .join(__dirname, '../uploads', 'animal_' + id + ".jpg")

    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath)
    }
  } catch (error) {
    res.send(res, "Image not found")
  }
}


module.exports = {
  createAnimal,
  updateAnimal,
  getAllAnimalsBelongToHabitat,
  getAllAnimals,
  getAnimalById,
  deleteAnimal,
  viewImage
};
