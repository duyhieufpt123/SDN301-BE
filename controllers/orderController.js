const Order = require('../models/Order');
const Account = require('../models/Account');
const Ticket = require('../models/ticket');

const createOrder = async (req, res) => {
    try {
      const { account, tickets } = req.body;
      let totalPrice = 0;
      let totalQuantity = 0;
  
      for (const item of tickets) {
        const ticket = await Ticket.findById(item.ticket);
        if (!ticket) {
          return res.status(404).send({ message: "Ticket not found with id: " + item.ticket });
        }
        // Change this line from ticket.price to ticket.ticketPrice
        if (typeof ticket.ticketPrice !== 'number') {
          return res.status(400).send({ message: "Invalid price for ticket with id: " + item.ticket });
        }
        // And this line as well
        totalPrice += ticket.ticketPrice * item.quantity;
        totalQuantity += item.quantity;
      }
      
  
      if (isNaN(totalPrice)) {
        return res.status(400).send({ message: "Fail to caculate total price" });
      }
  
      const order = new Order({
        account,
        tickets,
        totalPrice,
        quantity: totalQuantity
      });
  
      await order.save();
      res.status(201).send(order);
    } catch (error) {
      res.status(400).send(error);
    }
  };

const getOrderById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('account', '_id firstName lastName dateOfBirth username')
        .populate('tickets.ticket', '_id ticketName ticketPrice ticketType');
  
      if (!order) {
        return res.status(404).send('Order not found');
      }
  
      const filteredOrder = {
        orderid: order._id,
        totalOrderPrice: order.totalPrice,
        orderQuantity: order.quantity,
        account: {
            accountid: order.account._id,
            firstName: order.account.firstName,
            lastName: order.account.lastName,
            dateOfBirth: order.account.dateOfBirth,
            username: order.account.username,
        },
        tickets: order.tickets.map((t) => ({
          ticket: {
            ticketid: t.ticket._id,
            ticketName: t.ticket.ticketName,
            ticketPrice: t.ticket.ticketPrice,
            ticketType: t.ticket.ticketType,
            ticketQuantity: t.quantity,
          },
        })),
      };
  
      res.send(filteredOrder);
    } catch (error) {
      console.error('Error get order by ID:', error);
      res.status(500).send(error);
    }
  };
  
  const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('account', '_id firstName lastName dateOfBirth username')
        .populate('tickets.ticket', '_id ticketName ticketPrice ticketType');
  
      const filteredOrders = orders.map((order) => ({
        orderid: order._id,
        totalOrderPrice: order.totalPrice,
        orderQuantity: order.quantity,
        account:{
          accountid: order.account._id,
          firstName: order.account.firstName,
          lastName: order.account.lastName,
          dateOfBirth: order.account.dateOfBirth,
          username: order.account.username,
        },
        tickets: order.tickets.map((t) => ({
            ticketid: t.ticket._id,
            ticketName: t.ticket.ticketName,
            ticketPrice: t.ticket.ticketPrice,
            ticketType: t.ticket.ticketType,
            ticketQuantity: t.quantity,
        })),
      }));
  
      res.send(filteredOrders);
    } catch (error) {
      console.error('Get all orders fail:', error);
      res.status(500).send('Something Wrong with this thing :)');
    }
  };
  
  

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders
};
