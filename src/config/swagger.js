const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clear Taxi Go API',
      version: '1.0.0',
      description: 'Professional Taxi Booking API with driver profiles: image, rating, description, name, role'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Ì∫Ä Local Development Server'
      },
      {
        url: 'https://clear-tax-updated-backend-nodejs.onrender.com',
        description: 'Ìºê Production Server (Render)'
      }
    ],
    components: {
      schemas: {
        Driver: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
            image: { type: 'string', format: 'uri' },
            rating: { type: 'number', minimum: 0, maximum: 5 },
            description: { type: 'string' }
          }
        }
      }
    }
  },
  // Ì¥• CRITICAL: This MUST be correct - points to your route files
  apis: ['./src/routes/*.js']  // Using ./ for relative path from src/server.js
};

module.exports = { swaggerOptions };
