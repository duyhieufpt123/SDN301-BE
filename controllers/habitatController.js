const Habitat = require('../models/habitat');

const getAllHabitats = async (req, res) => {
    try {
      const habitats = await Habitat.find({}, 'habitatName habitatType habitatSize condition');        
  
      const filteredHabitats = habitats.map((habitat) => ({
        habitatid: habitat._id,
        habitatName: habitat.habitatName,
        habitatType: habitat.habitatType,
        habitatSize: habitat.habitatSize,
        condition: habitat.condition,
      }));
  
      res.status(200).send(filteredHabitats);
    } catch (error) {
      console.error('Get all habitats failed:', error);
      res.status(500).send('Something went wrong with get all habitats');
    }
  };
  
  
  
  const getHabitatById = async (req, res) => {
    const habitatid = req.params.id;
    try {
      const habitat = await Habitat.findById(habitatid, '_id habitatName habitatType habitatSize condition');
      if (!habitat) {
        return res.status(404).send({error: 'Habitat not found'});
      }
      const filteredHabitat = {
        habitatid: habitat._id,
        habitatName: habitat.habitatName,
        habitatType: habitat.habitatType,
        habitatSize: habitat.habitatSize,
        condition: habitat.condition,
      };
      res.status(200).send(filteredHabitat);
    } catch (error) {
      console.error('Error get habitat by ID:', error);
      res.status(500).send(error);
    }
  };
  
const createHabitat = async (req, res) => {
  const habitat = new Habitat(req.body);
  try {
    const duplicateHabitat = await Habitat.findOne({ name: req.body.name });
    if (duplicateHabitat) {
      return res.status(409).send({ message: 'A habitat with this name already exists.' });
    }
    await habitat.save();
    res.status(201).send(habitat);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateHabitat = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['habitatName', 'habitatType', 'habitatSize', 'condition'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const habitat = await Habitat.findById(req.params.id);
    if (!habitat) {
      return res.status(404).send();
    }
    updates.forEach((update) => habitat[update] = req.body[update]);
    await habitat.save();
    res.send(habitat);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteHabitat = async (req, res) => {
  try {
    const habitat = await Habitat.findByIdAndDelete(req.params.id);
    if (!habitat) {
      return res.status(404).send({error: 'Habitat not found'});
    }
    res.send({ message: 'Habitat deleted successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllHabitats,
  getHabitatById,
  createHabitat,
  updateHabitat,
  deleteHabitat
};
