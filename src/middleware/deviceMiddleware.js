const deviceModel = require('../models/deviceModel');

const checkDuplicateSerial = async (req, res, next) => {
  const { serial_number } = req.body;
  try {
    const existingDevice = await deviceModel.getDeviceBySerial(serial_number);
    if (existingDevice) {
      return res.status(400).json({
        message: 'Serial number already exists'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { checkDuplicateSerial };
