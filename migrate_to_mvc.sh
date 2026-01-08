#!/bin/bash
echo "Migrating Clear Taxi Go to MVC structure..."

# Backup current working code
cp server.js server_backup_$(date +%Y%m%d_%H%M%S).js

# Create new app.js with existing code
echo "Creating new structure with existing functionality..."

# Extract your existing endpoints and create controllers
echo "Creating driver controller..."
cat > src/controllers/driverController.js << 'DRIVER_EOF'
const Driver = require('../models/Driver');

exports.getDriverProfile = async (req, res, next) => {
  try {
    const { driver_id } = req.params;
    
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
    
    const driver = drivers[driver_id];
    if (driver) {
      res.status(200).json({
        success: true,
        data: driver
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Driver not found",
        available_drivers: Object.keys(drivers)
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllDrivers = async (req, res, next) => {
  try {
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
    
    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    next(error);
  }
};
DRIVER_EOF

echo "Creating service controller..."
cat > src/controllers/serviceController.js << 'SERVICE_EOF'
exports.getAvailableServices = async (req, res, next) => {
  try {
    const { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng } = req.query;
    
    // Mock fare calculation
    const calculateDistance = () => {
      if (!dropoff_lat || !dropoff_lng) return 5;
      return Math.random() * 20 + 3;
    };
    
    const distance = calculateDistance();
    
    const services = [
      {
        service_id: "ECO-001",
        name: "Economy",
        estimated_fare: parseFloat((5.00 + (1.50 * distance)).toFixed(2)),
        eta: Math.floor(Math.random() * 10) + 5,
        vehicle_type: "Compact Car",
        description: "Affordable everyday rides"
      },
      {
        service_id: "PRE-001",
        name: "Premium", 
        estimated_fare: parseFloat((8.00 + (2.50 * distance)).toFixed(2)),
        eta: Math.floor(Math.random() * 5) + 3,
        vehicle_type: "SUV",
        description: "Comfortable rides with extra space"
      },
      {
        service_id: "VIP-001",
        name: "VIP",
        estimated_fare: parseFloat((12.00 + (4.00 * distance)).toFixed(2)),
        eta: Math.floor(Math.random() * 3) + 2,
        vehicle_type: "Luxury Car",
        description: "Premium luxury experience"
      }
    ];
    
    res.status(200).json({
      success: true,
      data: services,
      distance_km: parseFloat(distance.toFixed(1))
    });
  } catch (error) {
    next(error);
  }
};
SERVICE_EOF

echo "Creating booking controller..."
cat > src/controllers/bookingController.js << 'BOOKING_EOF'
const { v4: uuidv4 } = require('uuid');

exports.createBooking = async (req, res, next) => {
  try {
    const { service_id, pickup_address, dropoff_address, payment_method_id } = req.body;
    
    if (!service_id || !pickup_address) {
      return res.status(400).json({
        success: false,
        error: "service_id and pickup_address are required"
      });
    }
    
    const services = {
      "ECO-001": { name: "Economy", base_fare: 5.00, per_km: 1.50 },
      "PRE-001": { name: "Premium", base_fare: 8.00, per_km: 2.50 },
      "VIP-001": { name: "VIP", base_fare: 12.00, per_km: 4.00 }
    };
    
    const service = services[service_id];
    if (!service) {
      return res.status(404).json({
        success: false,
        error: "Service not found"
      });
    }
    
    // Mock driver selection
    const drivers = [
      {
        id: "DRV-001",
        name: "Michael Rodriguez",
        rating: 4.9,
        vehicle: "Toyota Highlander"
      },
      {
        id: "DRV-002", 
        name: "Sarah Johnson",
        rating: 4.95,
        vehicle: "Mercedes E-Class"
      }
    ];
    
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    
    const booking = {
      booking_id: `BOOK-${uuidv4().slice(0, 8).toUpperCase()}`,
      service_id,
      pickup_address,
      dropoff_address: dropoff_address || "Not specified",
      payment_method_id: payment_method_id || "cash",
      driver_details: {
        driver_id: driver.id,
        name: driver.name,
        rating: driver.rating,
        vehicle: driver.vehicle,
        phone_number: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
      },
      fare: parseFloat((service.base_fare + (service.per_km * 8)).toFixed(2)),
      status: "confirmed",
      estimated_arrival: new Date(Date.now() + 15 * 60000).toISOString(),
      created_at: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const { booking_id } = req.params;
    
    res.status(200).json({
      success: true,
      data: {
        booking_id,
        status: "confirmed",
        estimated_arrival: new Date(Date.now() + 10 * 60000).toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
BOOKING_EOF

echo "Creating application controller..."
cat > src/controllers/applicationController.js << 'APPLICATION_EOF'
const { v4: uuidv4 } = require('uuid');

exports.createDriverApplication = async (req, res, next) => {
  try {
    const { full_name, email, phone_number, city, vehicle_type } = req.body;
    
    if (!full_name || !email || !phone_number) {
      return res.status(400).json({
        success: false,
        error: "full_name, email, and phone_number are required"
      });
    }
    
    const application = {
      application_id: `APP-${uuidv4().slice(0, 8).toUpperCase()}`,
      applicant: {
        full_name,
        email,
        phone_number,
        city: city || "Not specified",
        vehicle_type: vehicle_type || "Not specified"
      },
      status: "pending",
      submitted_at: new Date().toISOString(),
      next_steps: [
        "Upload driver license",
        "Upload vehicle registration", 
        "Submit background check consent",
        "Schedule vehicle inspection"
      ],
      estimated_processing_time: "3-5 business days"
    };
    
    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

exports.getApplicationStatus = async (req, res, next) => {
  try {
    const { application_id } = req.params;
    
    res.status(200).json({
      success: true,
      data: {
        application_id,
        status: "under_review",
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
APPLICATION_EOF

echo "✅ Migration complete!"
