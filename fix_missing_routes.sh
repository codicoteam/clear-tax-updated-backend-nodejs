#!/bin/bash
echo "Ì¥ß Fixing missing routes in Clear Taxi Go..."

# 1. UPDATE driverRoutes.js - ADD GET / (all drivers) endpoint
echo "Updating driverRoutes.js..."
cat > src/routes/driverRoutes.js << 'DRIVEREOF'
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Drivers]
 *     responses:
 *       200:
 *         description: List of all drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Driver'
 */
router.get('/', (req, res) => {
  const drivers = [
    {
      id: "DRV-001",
      name: "Michael Rodriguez",
      role: "Premium Partner",
      rating: 4.9
    },
    {
      id: "DRV-002",
      name: "Sarah Johnson",
      role: "VIP Driver", 
      rating: 4.95
    },
    {
      id: "DRV-003",
      name: "James Wilson",
      role: "Standard Driver",
      rating: 4.7
    }
  ];
  res.json(drivers);
});

/**
 * @swagger
 * /api/v1/drivers/{id}:
 *   get:
 *     summary: Get driver profile
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "DRV-001"
 *     responses:
 *       200:
 *         description: Driver profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Driver not found
 */
router.get('/:id', (req, res) => {
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
  
  const driver = drivers[req.params.id];
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
 * /api/test:
 *   get:
 *     summary: Test endpoint for Swagger
 *     responses:
 *       200:
 *         description: Successful test
 */
router.get('/test/api/test', (req, res) => {
  res.json({ message: "Test endpoint works!", timestamp: new Date().toISOString() });
});

module.exports = router;
DRIVEREOF
echo "‚úÖ Updated driverRoutes.js"

# 2. UPDATE bookingRoutes.js - ADD GET /:booking_id endpoint
echo "Updating bookingRoutes.js..."
cat > src/routes/bookingRoutes.js << 'BOOKINGEOF'
const express = require('express');
const router = express.Router();

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
 *                 example: "Times Square, NY"
 *               dropoff_address:
 *                 type: string
 *                 example: "JFK Airport"
 *               payment_method_id:
 *                 type: string
 *                 example: "cash"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/', (req, res) => {
  const { service_id, pickup_address } = req.body;
  
  if (!service_id || !pickup_address) {
    return res.status(400).json({ 
      error: "service_id and pickup_address are required" 
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
 * /api/v1/bookings/{booking_id}:
 *   get:
 *     summary: Get booking details
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *         example: "BOOK-123456"
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking_id:
 *                   type: string
 *                 status:
 *                   type: string
 *                 estimated_arrival:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Booking not found
 */
router.get('/:booking_id', (req, res) => {
  const { booking_id } = req.params;
  
  // Mock booking data
  const booking = {
    booking_id: booking_id,
    service_id: "PRE-001",
    pickup_address: "Times Square, NY",
    status: "confirmed",
    estimated_arrival: new Date(Date.now() + 10 * 60000).toISOString(),
    driver: {
      name: "Michael Rodriguez",
      rating: 4.9
    },
    fare: 25.75
  };
  
  res.json(booking);
});

module.exports = router;
BOOKINGEOF
echo "‚úÖ Updated bookingRoutes.js"

# 3. UPDATE applicationRoutes.js - ADD GET /:application_id endpoint
echo "Updating applicationRoutes.js..."
cat > src/routes/applicationRoutes.js << 'APPEOF'
const express = require('express');
const router = express.Router();

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
 *       400:
 *         description: Missing required fields
 */
router.post('/', (req, res) => {
  const { full_name, email, phone_number } = req.body;
  
  if (!full_name || !email || !phone_number) {
    return res.status(400).json({ 
      error: "full_name, email, and phone_number are required" 
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
 * /api/v1/driver/applications/{application_id}:
 *   get:
 *     summary: Get application status
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: application_id
 *         required: true
 *         schema:
 *           type: string
 *         example: "APP-123456"
 *     responses:
 *       200:
 *         description: Application status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 application_id:
 *                   type: string
 *                 status:
 *                   type: string
 *                 submitted_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Application not found
 */
router.get('/:application_id', (req, res) => {
  const { application_id } = req.params;
  
  // Mock application status
  const application = {
    application_id: application_id,
    applicant: {
      full_name: "John Smith",
      email: "john@example.com"
    },
    status: "under_review",
    submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    last_updated: new Date().toISOString(),
    current_step: "Background check in progress"
  };
  
  res.json(application);
});

module.exports = router;
APPEOF
echo "‚úÖ Updated applicationRoutes.js"

# 4. UPDATE src/server.js to properly mount routes
echo "Updating src/server.js route mounting..."
if [ -f "src/server.js" ]; then
    # Create a clean, working server.js
    cat > src/server.js << 'SERVEREOF'
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import Swagger configuration
const { swaggerOptions } = require('./config/swagger');
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Debug: Log Swagger info
console.log('Ì¥ç Swagger Configuration:');
console.log('   - Looking in:', swaggerOptions.apis);
console.log('   - Found endpoints:', Object.keys(swaggerSpec.paths || {}).length);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: "Clear Taxi Go API"
}));

// Import routes
const driverRoutes = require('./routes/driverRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// ‚úÖ CORRECT ROUTE MOUNTING - This was the problem!
app.use("/api/v1/drivers", driverRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/driver/applications", applicationRoutes);

// Test endpoint at root level (for /api/test)
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Test endpoint works!",
    timestamp: new Date().toISOString(),
    endpoints: [
      "/api/v1/drivers",
      "/api/v1/drivers/{id}",
      "/api/v1/services",
      "/api/v1/bookings",
      "/api/v1/bookings/{id}",
      "/api/v1/driver/applications",
      "/api/v1/driver/applications/{id}"
    ]
  });
});

// Health check
app.get("/health", (req, res) => { 
  res.status(200).json({ 
    status: "healthy", 
    service: "clear-taxi-go-api", 
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: [
      "/api/v1/drivers",
      "/api/v1/drivers/{id}",
      "/api/v1/services",
      "/api/v1/bookings",
      "/api/v1/bookings/{id}",
      "/api/v1/driver/applications",
      "/api/v1/driver/applications/{id}"
    ]
  }); 
});

// Homepage
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Clear Taxi Go API</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #2c3e50; }
          .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Ì∫ñ Clear Taxi Go API</h1>
        <p>All endpoints are now working!</p>
        
        <div class="endpoint">
          <h3>GET /api/v1/drivers</h3>
          <p>Get all drivers</p>
          <a href="/api/v1/drivers">Test Now</a>
        </div>
        
        <div class="endpoint">
          <h3>GET /api/v1/drivers/{id}</h3>
          <p>Get driver profile</p>
          <a href="/api/v1/drivers/DRV-001">Test DRV-001</a>
        </div>
        
        <div class="endpoint">
          <h3>GET /api/v1/bookings/{id}</h3>
          <p>Get booking details</p>
          <p>Use a booking ID from a POST request</p>
        </div>
        
        <div class="endpoint">
          <h3>GET /api/v1/driver/applications/{id}</h3>
          <p>Get application status</p>
          <p>Use an application ID from a POST request</p>
        </div>
        
        <p><a href="/api-docs">Ì≥ö Full Swagger Documentation</a></p>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(\`‚úÖ Server started on port \${PORT}\`);
  console.log(\`Ì≥ö Swagger Docs: http://localhost:\${PORT}/api-docs\`);
  console.log(\`Ìø• Health Check: http://localhost:\${PORT}/health\`);
  console.log(\`Ìºê Production: https://clear-tax-updated-backend-nodejs.onrender.com\`);
  console.log(\`ÌæØ Test these endpoints:\`);
  console.log(\`   GET  http://localhost:\${PORT}/api/v1/drivers\`);
  console.log(\`   GET  http://localhost:\${PORT}/api/v1/drivers/DRV-001\`);
  console.log(\`   GET  http://localhost:\${PORT}/api/test\`);
});
SERVEREOF
    echo "‚úÖ Updated src/server.js with correct route mounting"
fi

# 5. RESTART SERVER
echo "Restarting server..."
pkill -f "node.*3001" 2>/dev/null || true
sleep 1
node src/server.js &
SERVER_PID=$!
sleep 3

echo ""
echo "ÌæØ FIX COMPLETE! Testing endpoints:"
echo ""
echo "Ì±â GET All Drivers:     http://localhost:3001/api/v1/drivers"
echo "Ì±â GET Driver DRV-001:  http://localhost:3001/api/v1/drivers/DRV-001"
echo "Ì±â GET Test Endpoint:   http://localhost:3001/api/test"
echo "Ì±â GET Health:          http://localhost:3001/health"
echo "Ì±â Swagger UI:          http://localhost:3001/api-docs"
echo ""
echo "Ì≥ù Note:"
echo "- /api/v1/bookings/{id} needs a booking ID from a POST /api/v1/bookings"
echo "- /api/v1/driver/applications/{id} needs an app ID from a POST /api/v1/driver/applications"
