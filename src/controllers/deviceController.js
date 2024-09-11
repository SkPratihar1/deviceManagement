
const deviceModel = require('../models/deviceModel');

const addDevice = async (req, res) => {
    try {
        const { name, type, serial_number } = req.body;
        const newDeviceId = await deviceModel.addDevice(name, type, serial_number);
        res.status(201).json({
            message: 'Device added successfully',
            id: newDeviceId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, serial_number } = req.body;
        await deviceModel.updateDevice(id, name, type, serial_number);
        res.status(200).json({
            message: 'Device updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getDeviceById = async (req, res) => {
    try {
        const { id } = req.params;
        const device = await deviceModel.getDeviceById(id);
        if (device) {
            res.status(200).json({
                message: 'Device retrieved successfully',
                device
            });
            
        } else {
            res.status(404).json({ message: 'Device not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllDevices = async (req, res) => {
    try {
        const devices = await deviceModel.getAllDevices();
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const assignDevice = async (req, res) => {
    const { employee_id, device_id } = req.body;
  
    // Validate input to ensure employee_id and device_id are integers
    if (!Number.isInteger(Number(employee_id)) || !Number.isInteger(Number(device_id))) {
      return res.status(400).json({ error: 'Invalid input: employee_id and device_id must be integers' });
    }
  
    try {
      // Use the model function to assign the device and track history
      await deviceModel.assignDevice(employee_id, device_id);
      res.json({ message: 'Device assigned and history updated' });
    } catch (error) {
      res.status(500).json({ error: 'Error assigning device' });
    }
  };

module.exports = {
    addDevice,
    updateDevice,
    getDeviceById,
    getAllDevices,
    assignDevice
   
    // Add any other functions you need to export
};






// exports.addDevice = async (req, res) => {
//   const { name, serial_number } = req.body;
//   try {
//     await pool.query(
//       'INSERT INTO devices (name, type, serial_number) VALUES ($1, $2)',
//       [name, serial_number]
//     );
//     res.status(201).json({ message: 'Device added successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error adding device' });
//   }
// };//1800-419-0157

// // Assign a device to an employee and track history
// exports.assignDevice = async (req, res) => {
//   const { employee_id, device_id } = req.body;
//   try {
//     // Assign the device to the employee
//     await pool.query(
//       'UPDATE devices SET employee_id = $1 WHERE id = $2',
//       [employee_id, device_id]
//     );
    
//     // Track the history of the device assignment
//     await pool.query(
//       'INSERT INTO device_history (device_id, employee_id) VALUES ($1, $2)',
//       [device_id, employee_id]
//     );
    
//     res.json({ message: 'Device assigned and history updated' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error assigning device' });
//   }
// };

// module.exports = {
//     addDevice,
//     updateDevice,
//     // deleteEmployee,
//     // getEmployeeById,
//     // getAllEmployees
// };
