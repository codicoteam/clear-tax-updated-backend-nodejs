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

// ‚úÖ CORRECT ROUTE MOUNTING
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

// Start server - NO ESCAPE CHARACTERS
app.listen(PORT, () => {
  console.log("‚úÖ Server started on port " + PORT);
  console.log("Ì≥ö Swagger Docs: http://localhost:" + PORT + "/api-docs");
  console.log("Ìø• Health Check: http://localhost:" + PORT + "/health");
  console.log("Ìºê Production: https://clear-tax-updated-backend-nodejs.onrender.com");
  console.log("ÌæØ Test these endpoints:");
  console.log("   GET  http://localhost:" + PORT + "/api/v1/drivers");
  console.log("   GET  http://localhost:" + PORT + "/api/v1/drivers/DRV-001");
  console.log("   GET  http://localhost:" + PORT + "/api/test");
});
