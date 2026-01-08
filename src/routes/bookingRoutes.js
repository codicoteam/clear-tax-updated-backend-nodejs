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
