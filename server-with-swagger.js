const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();
const PORT = 3000;

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
    ]
  },
  apis: ["./server-with-swagger.js"] // file containing annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
    booking_id: "BOOK-12345",
    service_id: req.body.service_id,
    pickup_address: req.body.pickup_address,
    driver_details: {
      name: "Michael Rodriguez",
      rating: 4.9,
      vehicle: "Toyota Highlander"
    },
    status: "confirmed",
    estimated_arrival: "2024-01-15T14:30:00Z"
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
    application_id: "APP-67890",
    full_name: req.body.full_name,
    email: req.body.email,
    status: "pending",
    next_steps: ["Upload license", "Background check"]
  };
  res.status(201).json(application);
});

// Homepage
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Clear Taxi Go API</title></head>
      <body>
        <h1>��� Clear Taxi Go API</h1>
        <p><strong>APIs are working! Now with Swagger documentation!</strong></p>
        <p>��� <a href="/api-docs">Go to Swagger UI</a> to test all APIs interactively</p>
        <p>Available endpoints:</p>
        <ul>
          <li><a href="/api/v1/services">GET /api/v1/services</a></li>
          <li><a href="/api/v1/drivers/DRV-001">GET /api/v1/drivers/DRV-001</a></li>
          <li>POST /api/v1/bookings (test in Swagger)</li>
          <li>POST /api/v1/driver/applications (test in Swagger)</li>
        </ul>
      </body>
    </html>
  `);
});

app.get("/health", (req, res) => { 
  res.status(200).json({ status: "healthy", service: "clear-taxi-go-api", timestamp: new Date().toISOString() }); 
});
app.listen(PORT, () => {
  console.log("✅ SERVER WITH SWAGGER STARTED!");
  console.log(`��� Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`��� Homepage: http://localhost:${PORT}`);
});
