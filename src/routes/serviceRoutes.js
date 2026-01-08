const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: Get available taxi services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: pickup_lat
 *         schema:
 *           type: number
 *         example: 40.7128
 *       - in: query
 *         name: pickup_lng
 *         schema:
 *           type: number
 *         example: -74.0060
 *     responses:
 *       200:
 *         description: List of available services with estimated fares
 */
router.get('/', serviceController.getAvailableServices);

module.exports = router;
