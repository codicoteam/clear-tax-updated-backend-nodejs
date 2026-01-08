const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// ===== SIMPLE CORS - ALLOW EVERYTHING =====
app.use(cors());  // This allows ALL origins for development

// For production, you can restrict it later:
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://clear-tax-updated-backend-nodejs.onrender.com']
// }));

app.use(express.json());

// ===== SWAGGER CONFIGURATION =====
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clear Taxi Go API",
      version: "1.0.0",
      description: "API for taxi booking with driver profiles"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "íº€ Local Development Server"
      },
      {
        url: "https://clear-tax-updated-backend-nodejs.onrender.com",
        description: "í¼ Live Production Server"
      }
    ]
  },
  apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== YOUR APIs =====
app.get("/api/v1/services", (req, res) => {
  const services = [
    { service_id: "ECO-001", name: "Economy", estimated_fare: 15.50, eta: 8 },
    { service_id: "PRE-001", name: "Premium", estimated_fare: 25.75, eta: 5 },
    { service_id: "VIP-001", name: "VIP", estimated_fare: 45.00, eta: 3 }
  ];
  res.json(services);
});

app.get("/api/v1/drivers/:driver_id", (req, res) => {
  const drivers = {
    "DRV-001": {
      id: "DRV-001", name: "Michael Rodriguez", role: "Premium Partner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      rating: 4.9, description: "5-star driver with luxury SUV"
    }
  };
  const driver = drivers[req.params.driver_id] || { error: "Driver not found" };
  res.json(driver);
});

app.post("/api/v1/bookings", (req, res) => {
  const booking = {
    booking_id: "BOOK-" + Date.now(),
    service_id: req.body.service_id,
    status: "confirmed"
  };
  res.status(201).json(booking);
});

app.post("/api/v1/driver/applications", (req, res) => {
  const application = {
    application_id: "APP-" + Date.now(),
    status: "pending"
  };
  res.status(201).json(application);
});

app.get("/health", (req, res) => { 
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send(`
    <html><body>
      <h1>íº– Clear Taxi Go API</h1>
      <p><a href="/api-docs">Swagger Docs</a></p>
      <p><a href="/health">Health Check</a></p>
      <p><a href="/api/v1/drivers/DRV-001">Test Driver API</a></p>
    </body></html>
  `);
});

app.listen(PORT, () => {
  console.log(`âœ… Server running on port ${PORT}`);
  console.log(`í³š Swagger: http://localhost:${PORT}/api-docs`);
});
