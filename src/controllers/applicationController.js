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
