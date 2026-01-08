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
