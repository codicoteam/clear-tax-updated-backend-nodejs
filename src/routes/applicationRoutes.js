const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/driver/applications:
 *   post:
 *     summary: Apply to become a driver
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - phone_number
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "John Smith"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               phone_number:
 *                 type: string
 *                 example: "+1-555-123-4567"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               vehicle_type:
 *                 type: string
 *                 example: "Toyota Camry"
 *     responses:
 *       201:
 *         description: Application submitted
 *       400:
 *         description: Missing required fields
 */
router.post('/', (req, res) => {
  const { full_name, email, phone_number } = req.body;
  
  if (!full_name || !email || !phone_number) {
    return res.status(400).json({ 
      error: "full_name, email, and phone_number are required" 
    });
  }
  
  const application = {
    application_id: "APP-" + Date.now(),
    applicant: {
      full_name: full_name,
      email: email,
      phone_number: phone_number,
      city: req.body.city || "Not specified",
      vehicle_type: req.body.vehicle_type || "Not specified"
    },
    status: "pending",
    submitted_at: new Date().toISOString(),
    next_steps: [
      "Upload driver license",
      "Submit background check consent", 
      "Schedule vehicle inspection"
    ],
    estimated_processing: "3-5 business days"
  };
  
  res.status(201).json(application);
});

/**
 * @swagger
 * /api/v1/driver/applications/{application_id}:
 *   get:
 *     summary: Get application status
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: application_id
 *         required: true
 *         schema:
 *           type: string
 *         example: "APP-123456"
 *     responses:
 *       200:
 *         description: Application status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 application_id:
 *                   type: string
 *                 status:
 *                   type: string
 *                 submitted_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Application not found
 */
router.get('/:application_id', (req, res) => {
  const { application_id } = req.params;
  
  // Mock application status
  const application = {
    application_id: application_id,
    applicant: {
      full_name: "John Smith",
      email: "john@example.com"
    },
    status: "under_review",
    submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    last_updated: new Date().toISOString(),
    current_step: "Background check in progress"
  };
  
  res.json(application);
});

module.exports = router;
