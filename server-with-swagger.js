const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors"); // ADD THIS LINE
const app = express();
const PORT = process.env.PORT || 3000; // UPDATED FOR RENDER

// ===== CORS MIDDLEWARE (ADD THIS) =====
app.use(cors({
  origin: ['http://localhost:3000', 'https://clear-tax-updated-backend-nodejs.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ===== SWAGGER CONFIGURATION =====
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clear Taxi Go API",
      version: "1.0.0",
      description: "API for taxi booking with driver profiles including: image, rating, description, name, role"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "🚀 Local Development Server"
      },
      {
        url: "https://clear-tax-updated-backend-nodejs.onrender.com",
        description: "🌐 Live Production Server (Render)"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./server-with-swagger.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ===== SWAGGER UI SETUP WITH CORS FIX =====
const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Clear Taxi Go API Documentation",
  swaggerOptions: {
    urls: [
      {
        url: '/api-docs/swagger.json',
        name: 'Clear Taxi Go API v1'
      }
    ],
    persistAuthorization: true,
    displayRequestDuration: true
  }
};

// Serve swagger.json file
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// ===== YOUR APIs WITH SWAGGER ANNOTATIONS =====

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: Get available taxi services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: pickup_lat
 *         schema:
 *           type: number
 *         example: 40.7128
 *       - in: query
 *         name: pickup_lng
 *         schema:
 *           type: number
 *         example: -74.0060
 *     responses:
 *       200:
 *         description: List of available services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   service_id:
 *                     type: string
 *                     example: "ECO-001"
 *                   name:
 *                     type: string
 *                     example: "Economy"
 *                   estimated_fare:
 *                     type: number
 *                     example: 15.50
 *                   eta:
 *                     type: number
 *                     example: 8
 */
app.get("/api/v1/services", (req, res) => {
  const services = [
    {
      service_id: "ECO-001",
      name: "Economy",
      estimated_fare: 15.50,
      eta: 8,
      vehicle_type: "Toyota Corolla"
    },
    {
      service_id: "PRE-001",
      name: "Premium",
      estimated_fare: 25.75,
      eta: 5,
      vehicle_type: "Honda CR-V"
    },
    {
      service_id: "VIP-001",
      name: "VIP",
      estimated_fare: 45.00,
      eta: 3,
      vehicle_type: "Mercedes S-Class"
    }
  ];
  res.json(services);
});

/**
 * @swagger
 * /api/v1/drivers/{driver_id}:
 *   get:
 *     summary: Get driver profile
 *     tags: [Drivers]
 *     description: Returns driver with attributes - image, rating, description, name, role
 *     parameters:
 *       - in: path
 *         name: driver_id
 *         required: true
 *         schema:
 *           type: string
 *         example: "DRV-001"
 *     responses:
 *       200:
 *         description: Driver profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "DRV-001"
 *                 name:
 *                   type: string
 *                   example: "Michael Rodriguez"
 *                 role:
 *                   type: string
 *                   example: "Premium Partner"
 *                 image:
 *                   type: string
 *                   example: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
 *                 rating:
 *                   type: number
 *                   example: 4.9
 *                 description:
 *                   type: string
 *                   example: "5-star driver with luxury SUV. 8 years experience."
 */
app.get("/api/v1/drivers/:driver_id", (req, res) => {
  const drivers = {
    "DRV-001": {
      id: "DRV-001",
      name: "Michael Rodriguez",
      role: "Premium Partner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      rating: 4.9,
      description: "5-star driver with luxury SUV. 8 years experience."
    },
    "DRV-002": {
      id: "DRV-002",
      name: "Sarah Johnson",
      role: "VIP Driver",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 4.95,
      description: "Executive driver with Mercedes. Multilingual."
    },
    "DRV-003": {
      id: "DRV-003",
      name: "James Wilson",
      role: "Standard Driver",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      rating: 4.7,
      description: "Friendly driver with clean minivan for families."
    }
  };
  
  const driver = drivers[req.params.driver_id];
  if (driver) {
    res.json(driver);
  } else {
    res.status(404).json({ error: "Driver not found" });
  }
});

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Book a taxi service
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service_id
 *               - pickup_address
 *             properties:
 *               service_id:
 *                 type: string
 *                 example: "PRE-001"
 *               pickup_address:
 *                 type: string
 *                 example: "Times Square, New York"
 *               dropoff_address:
 *                 type: string
 *                 example: "JFK Airport"
 *               payment_method_id:
 *                 type: string
 *                 example: "cash"
 *     responses:
 *       201:
 *         description: Booking created
 */
app.post("/api/v1/bookings", (req, res) => {
  const booking = {
    booking_id: "BOOK-" + Date.now(),
    service_id: req.body.service_id,
    pickup_address: req.body.pickup_address,
    dropoff_address: req.body.dropoff_address || "Not specified",
    payment_method_id: req.body.payment_method_id || "cash",
    driver_details: {
      name: "Michael Rodriguez",
      rating: 4.9,
      vehicle: "Toyota Highlander",
      phone: "+1-555-123-4567"
    },
    status: "confirmed",
    estimated_arrival: new Date(Date.now() + 15 * 60000).toISOString(),
    created_at: new Date().toISOString()
  };
  res.status(201).json(booking);
});

/**
 * @swagger
 * /api/v1/driver/applications:
 *   post:
 *     summary: Apply to become a driver
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - phone_number
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "John Smith"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               phone_number:
 *                 type: string
 *                 example: "+1-555-123-4567"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               vehicle_type:
 *                 type: string
 *                 example: "Toyota Camry"
 *     responses:
 *       201:
 *         description: Application submitted
 */
app.post("/api/v1/driver/applications", (req, res) => {
  const application = {
    application_id: "APP-" + Date.now(),
    applicant: {
      full_name: req.body.full_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      city: req.body.city || "Not specified",
      vehicle_type: req.body.vehicle_type || "Not specified"
    },
    status: "pending",
    submitted_at: new Date().toISOString(),
    next_steps: ["Upload driver license", "Submit background check", "Vehicle inspection"],
    estimated_processing: "3-5 business days"
  };
  res.status(201).json(application);
});

// Homepage
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Clear Taxi Go API</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
          h1 { color: #2c3e50; }
          .api-link { display: block; margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
          .server { margin: 20px 0; padding: 15px; background: #e8f4f8; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>🚖 Clear Taxi Go API</h1>
        <p><strong>✅ APIs are working perfectly! Now with Swagger documentation!</strong></p>
        
        <div class="server">
          <h3>📚 Interactive Documentation:</h3>
          <a class="api-link" href="/api-docs">Go to Swagger UI</a>
        </div>
        
        <div class="server">
          <h3>🌐 Available Servers:</h3>
          <p><strong>Local:</strong> http://localhost:${PORT}</p>
          <p><strong>Production:</strong> https://clear-tax-updated-backend-nodejs.onrender.com</p>
        </div>
        
        <div class="server">
          <h3>🔗 Test Endpoints:</h3>
          <a class="api-link" href="/api/v1/services">GET /api/v1/services</a>
          <a class="api-link" href="/api/v1/drivers/DRV-001">GET /api/v1/drivers/DRV-001</a>
          <a class="api-link" href="/health">GET /health (Health Check)</a>
        </div>
        
        <div class="server">
          <h3>📞 Support:</h3>
          <p>Swagger UI: <code>/api-docs</code></p>
          <p>Health Check: <code>/health</code></p>
          <p>GitHub: <code>codicoteam/clear-tax-updated-backend-nodejs</code></p>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get("/health", (req, res) => { 
  res.status(200).json({ 
    status: "healthy", 
    service: "clear-taxi-go-api", 
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: [
      "/api/v1/services",
      "/api/v1/drivers/{id}",
      "/api/v1/bookings",
      "/api/v1/driver/applications"
    ]
  }); 
});

// Start server
app.listen(PORT, () => {
  console.log("✅ SERVER WITH SWAGGER STARTED!");
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🌐 Homepage: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🚀 Ready for production: https://clear-tax-updated-backend-nodejs.onrender.com`);
});