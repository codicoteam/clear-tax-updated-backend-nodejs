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
