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
