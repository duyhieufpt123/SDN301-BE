const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Zoo API',
      version: '1.0.0',
      description: 'A simple Express Zoo API',
    },
    servers: [{
      url: 'http://localhost:5000/api',
    }],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  },
  apis: ['./routes/*.js', './docs/**/*.yaml'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
