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
