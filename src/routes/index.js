const express = require('express');
const router = express.Router();

// Import route modules
const driverRoutes = require('./driverRoutes');
const serviceRoutes = require('./serviceRoutes');
const bookingRoutes = require('./bookingRoutes');
const applicationRoutes = require('./applicationRoutes');

// Mount routes
router.use('/drivers', driverRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/driver/applications', applicationRoutes);

module.exports = router;

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test endpoint
 *     responses:
 *       200:
 *         description: Test successful
 */
