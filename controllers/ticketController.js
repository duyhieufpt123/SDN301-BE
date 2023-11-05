const Ticket = require('../models/ticket');

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({}, '_id ticketName ticketPrice ticketType');
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTicketById = async (req, res) => {
    const ticketid = req.params.id;
  try {
    const ticket = await Ticket.findById(ticketid, 'ticketid ticketName ticketPrice ticketType');
    if (!ticket) {
      return res.status(404).send({error: 'Ticket Not Found'});
    }
    res.send(ticket);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createTicket = async (req, res) => {
  try {
    const duplicateTicket = await Ticket.findOne({ ticketName: req.body.ticketName });
    if (duplicateTicket) {
      return res.status(409).send({ message: 'A ticket with this name already exists.' });
    }
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).send(ticket);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ticket) {
      return res.status(404).send();
    }
    res.send(ticket);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).send({error: 'Ticket Not Found'});
    }
    res.send({message: 'Ticket Deleted Successfully'});
  } catch (error) {
    res.status(500).send(error);
  }
};


module.exports = {
    deleteTicket,
    updateTicket,
    getTicketById,
    getAllTickets,
    createTicket
  };
  