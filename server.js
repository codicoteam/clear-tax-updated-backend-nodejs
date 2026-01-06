const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// ===== YOUR WORKING APIS =====

// 1. GET available services
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

// 2. POST book a service
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

// 3. GET driver profile (YOUR REQUESTED ATTRIBUTES)
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

// 4. POST driver application
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

// Health check
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Clear Taxi Go API</title></head>
      <body>
        <h1>Ì∫ñ Clear Taxi Go API is RUNNING!</h1>
        <p>Test these endpoints:</p>
        <ul>
          <li><a href="/api/v1/services">GET /api/v1/services</a></li>
          <li><a href="/api/v1/drivers/DRV-001">GET /api/v1/drivers/DRV-001</a></li>
          <li>POST /api/v1/bookings (use curl or Postman)</li>
          <li>POST /api/v1/driver/applications (use curl or Postman)</li>
        </ul>
        <p>Server is running on port ${PORT}</p>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log("‚úÖ SERVER STARTED SUCCESSFULLY!");
  console.log(`Ìºê Open: http://localhost:${PORT}`);
  console.log(`Ì∫ï Test APIs:`);
  console.log(`   GET  http://localhost:${PORT}/api/v1/services`);
  console.log(`   GET  http://localhost:${PORT}/api/v1/drivers/DRV-001`);
  console.log(`   POST http://localhost:${PORT}/api/v1/bookings`);
  console.log(`   POST http://localhost:${PORT}/api/v1/driver/applications`);
});
