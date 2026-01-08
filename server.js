const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors");
const path = require("path"); // ADD THIS
const app = express();
const PORT = process.env.PORT || 3001;

// ===== CORS =====
app.use(cors());

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
        url: "http://localhost:3001",
        description: "🚀 Local Development Server"
      },
      {
        url: "https://clear-tax-updated-backend-nodejs.onrender.com",
        description: "🌐 Live Production Server (Render)"
      }
    ]
  },
  // FIXED: Use absolute path with __dirname
  apis: [path.join(__dirname, "server.js")]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Log Swagger spec for debugging
console.log("Swagger spec generated:", Object.keys(swaggerSpec.paths || {}).length, "endpoints found");

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: "Clear Taxi Go API"
}));

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
 *                   vehicle_type:
 *                     type: string
 *                     example: "Toyota Corolla"
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
 *         description: Driver profile details
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
 *                   format: uri
 *                   example: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
 *                 rating:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 5
 *                   example: 4.9
 *                 description:
 *                   type: string
 *                   example: "5-star driver with luxury SUV. 8 years experience."
 *       404:
 *         description: Driver not found
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
    res.status(404).json({ 
      error: "Driver not found",
      available_drivers: ["DRV-001", "DRV-002", "DRV-003"]
    });
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
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking_id:
 *                   type: string
 *                   example: "BOOK-12345"
 *                 service_id:
 *                   type: string
 *                 pickup_address:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "confirmed"
 *       400:
 *         description: Missing required fields
 */
app.post("/api/v1/bookings", (req, res) => {
  const { service_id, pickup_address } = req.body;
  
  if (!service_id || !pickup_address) {
    return res.status(400).json({ 
      error: "Missing required fields: service_id and pickup_address are required" 
    });
  }
  
  const booking = {
    booking_id: "BOOK-" + Date.now(),
    service_id: service_id,
    pickup_address: pickup_address,
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
 *                 format: email
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 application_id:
 *                   type: string
 *                   example: "APP-67890"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *                 submitted_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing required fields
 */
app.post("/api/v1/driver/applications", (req, res) => {
  const { full_name, email, phone_number } = req.body;
  
  if (!full_name || !email || !phone_number) {
    return res.status(400).json({ 
      error: "Missing required fields: full_name, email, and phone_number are required" 
    });
  }
  
  const application = {
    application_id: "APP-" + Date.now(),
    applicant: {
      full_name: full_name,
      email: email,
      phone_number: phone_number,
      city: req.body.city || "Not specified",
      vehicle_type: req.body.vehicle_type || "Not specified"
    },
    status: "pending",
    submitted_at: new Date().toISOString(),
    next_steps: [
      "Upload driver license",
      "Submit background check consent", 
      "Schedule vehicle inspection"
    ],
    estimated_processing: "3-5 business days"
  };
  
  res.status(201).json(application);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 service:
 *                   type: string
 *                   example: "clear-taxi-go-api"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
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
      "/api/v1/driver/applications",
      "/api-docs"
    ]
  }); 
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Homepage
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: HTML homepage
 */
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Clear Taxi Go API</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 {
          color: #2c3e50;
          border-bottom: 3px solid #3498db;
          padding-bottom: 10px;
        }
        .card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .endpoint {
          background: white;
          padding: 15px;
          border-radius: 6px;
          margin: 10px 0;
          border: 1px solid #ddd;
        }
        .btn {
          display: inline-block;
          background: #3498db;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin: 5px;
          font-weight: bold;
        }
        .btn:hover {
          background: #2980b9;
        }
        .server-info {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .server-box {
          flex: 1;
          min-width: 300px;
          background: #e8f4f8;
          padding: 15px;
          border-radius: 6px;
        }
        code {
          background: #f1f1f1;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        .success {
          color: #27ae60;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>🚖 Clear Taxi Go API</h1>
      <p class="success">✅ API is running successfully!</p>
      
      <div class="card">
        <h2>📚 Interactive Documentation</h2>
        <p>Test all endpoints with Swagger UI:</p>
        <a class="btn" href="/api-docs">Open Swagger UI</a>
      </div>
      
      <div class="card">
        <h2>🌐 Available Servers</h2>
        <div class="server-info">
          <div class="server-box">
            <h3>🚀 Local Development</h3>
            <p><code>http://localhost:${PORT}</code></p>
            <p>For local testing and development</p>
          </div>
          <div class="server-box">
            <h3>🌐 Production (Render)</h3>
            <p><code>https://clear-tax-updated-backend-nodejs.onrender.com</code></p>
            <p>Live production API</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2>🔗 API Endpoints</h2>
        
        <div class="endpoint">
          <h3>GET /api/v1/services</h3>
          <p>Get available taxi services with pricing</p>
          <a class="btn" href="/api/v1/services">Test Now</a>
        </div>
        
        <div class="endpoint">
          <h3>GET /api/v1/drivers/{id}</h3>
          <p>Get driver profile with: <strong>image, rating, description, name, role</strong></p>
          <a class="btn" href="/api/v1/drivers/DRV-001">Test DRV-001</a>
          <a class="btn" href="/api/v1/drivers/DRV-002">Test DRV-002</a>
          <a class="btn" href="/api/v1/drivers/DRV-003">Test DRV-003</a>
        </div>
        
        <div class="endpoint">
          <h3>POST /api/v1/bookings</h3>
          <p>Book a taxi service (use Swagger UI or curl to test)</p>
        </div>
        
        <div class="endpoint">
          <h3>POST /api/v1/driver/applications</h3>
          <p>Apply to become a driver</p>
        </div>
        
        <div class="endpoint">
          <h3>GET /health</h3>
          <p>Health check endpoint</p>
          <a class="btn" href="/health">Check Health</a>
        </div>
      </div>
      
      <div class="card">
        <h2>📞 Support & Information</h2>
        <p><strong>Repository:</strong> <code>codicoteam/clear-tax-updated-backend-nodejs</code></p>
        <p><strong>Render Dashboard:</strong> <code>https://dashboard.render.com</code></p>
        <p><strong>Local Server Port:</strong> <code>${PORT}</code></p>
        <p><strong>All endpoints include CORS headers for cross-origin requests</strong></p>
      </div>
      
      <footer style="margin-top: 40px; text-align: center; color: #777; border-top: 1px solid #eee; padding-top: 20px;">
        <p>Clear Taxi Go API • Version 1.0.0 • Excellent Deployment 🚀</p>
      </footer>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`🏠 Homepage: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`🚀 Production: https://clear-tax-updated-backend-nodejs.onrender.com`);
  console.log(`🎯 API Endpoints:`);
  console.log(`   GET  /api/v1/services`);
  console.log(`   GET  /api/v1/drivers/{id}`);
  console.log(`   POST /api/v1/bookings`);
  console.log(`   POST /api/v1/driver/applications`);
});