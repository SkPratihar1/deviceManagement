const deviceModel = require('../models/deviceModel');
const { assignDeviceSchema } = require('../schemas/assignDeviceSchema');
const { deviceSchema } =  require('../schemas/deviceSchema');
const { z } = require('zod');


const addDevice = async (req, res) => {
  try {
    // Validate input using Zod
    const validatedData = deviceSchema.parse(req.body);

    const { name, type, serial_number } = validatedData;
    const newDeviceId = await deviceModel.addDevice(name, type, serial_number);

    res.status(201).json({
      message: 'Device added successfully',
      id: newDeviceId
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update Device
const updateDevice = async (req, res) => {
  try {
    // Validate input using Zod
    const validatedData = deviceSchema.parse(req.body);

    const { id } = req.params;
    const { name, type, serial_number } = validatedData;

    await deviceModel.updateDevice(id, name, type, serial_number);
    res.status(200).json({
      message: 'Device updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get Device by ID
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

// Get All Devices
const getAllDevices = async (req, res) => {
  try {
    const devices = await deviceModel.getAllDevices();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// module.exports = {
//   addDevice,
//   updateDevice,
//   getDeviceById,
//   getAllDevices
// };




// const assignDevice = async (req, res) => {
//     try {
//       const parsedData = assignDeviceSchema.parse(req.body);
  
//       // Check device status
//       const deviceStatus = await deviceModel.getDeviceStatus(parsedData.device_id);
  
//       if (deviceStatus && deviceStatus.assigned_to) {
//         return res.status(400).json({ error: 'Device is already assigned to another employee' });
//       }
  
//       // Assign the device
//       await deviceModel.assignDevice(parsedData.employee_id, parsedData.device_id);
  
//       res.json({ message: 'Device assigned and status updated' });
//     } catch (error) {
//       console.error('Error in assignDevice:', error); // Detailed error logging
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ error: error.errors });
//       }
//       res.status(500).json({ error: 'Error assigning device' });
//     }
//   };

// const assignDevice = async (req, res) => {
//     try {
//       const parsedData = assignDeviceSchema.parse(req.body);
  
//       // Check device status
//       const deviceStatus = await deviceModel.getDeviceStatus(parsedData.device_id);
  
//       if (deviceStatus && deviceStatus.assigned_to) {
//         return res.status(400).json({ error: 'Device is already assigned to another employee' });
//       }
  
//       // Assign the device
//       await deviceModel.assignDevice(parsedData.employee_id, parsedData.device_id);
  
//       // Log the assignment in the device_history table
//       const historyData = {
//         employee_id: parsedData.employee_id,
//         device_id: parsedData.device_id,
//         action: 'Assigned',  // or 'Reassigned' if you want to differentiate
//         details: `Device assigned to employee ID ${parsedData.employee_id}`,
//       };
      
//       await deviceModel.historyQuery(historyData);
  
//       res.json({ message: 'Device assigned and status updated, log tracked' });
//     } catch (error) {
//       console.error('Error in assignDevice:', error); // Detailed error logging
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ error: error.errors });
//       }
//       res.status(500).json({ error: 'Error assigning device' });
//     }
//   };
  
  
 //const { pool } = require('../db'); // Ensure you have your pool or DB connection
 const pool = require('../config/db');;

  const assignDevice = async (req, res) => {
    const client = await pool.connect(); // Start a client connection
    try {
      await client.query('BEGIN'); // Start the transaction
  
      const parsedData = assignDeviceSchema.parse(req.body);
  
      // Check device status
      const deviceStatus = await deviceModel.getDeviceStatus(parsedData.device_id, client);
  
      if (deviceStatus && deviceStatus.assigned_to) {
        return res.status(400).json({ error: 'Device is already assigned to another employee' });
      }
  
      // Assign the device
      await deviceModel.assignDevice(parsedData.employee_id, parsedData.device_id, client);
  
      // Log the assignment in the device_history table
      const historyData = {
        employee_id: parsedData.employee_id,
        device_id: parsedData.device_id,
        action: 'Assigned',  // or 'Reassigned' if you want to differentiate
        details: `Device assigned to employee ID ${parsedData.employee_id}`,
      };
  
      await deviceModel.historyQuery(historyData, client);
  
      await client.query('COMMIT'); // Commit the transaction if all succeeds
      res.json({ message: 'Device assigned and status updated, log tracked' });
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback the transaction in case of any error
      console.error('Error in assignDevice:', error); // Detailed error logging
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Error assigning device' });
    } finally {
      client.release(); // Release the client connection
    }
  };
  


// const assignDevice = async (req, res) => {
//     try {
//       const parsedData = assignDeviceSchema.parse(req.body);
  
//       // Check current status of the device
//       const deviceStatus = await deviceModel.getDeviceStatus(parsedData.device_id);
  
//       // If the device is already assigned to an employee and action is not a return, prevent reassignment
//       if (deviceStatus && deviceStatus.assigned_to) {
//         if (parsedData.action !== 'return') {
//           return res.status(400).json({ 
//             error: `Device is already assigned to employee ${deviceStatus.assigned_to}. Return it before reassigning.` 
//           });
//         }
  
//         // If action is a return, log the return and unassign the device
//         await deviceModel.updateDeviceHistory({
//           device_id: parsedData.device_id,
//           employee_id: deviceStatus.assigned_to, // Log return for current employee
//           action: 'returned',
//           details: `Device returned by employee ${deviceStatus.assigned_to}`
//         });
  
//         // Update device as unassigned
//         await deviceModel.unassignDevice(parsedData.device_id);
//         return res.json({ message: 'Device returned and unassigned' });
//       }
  
//       // Check if device is going for repair or maintenance
//       if (parsedData.action === 'repair') {
//         await deviceModel.updateDeviceHistory({
//           device_id: parsedData.device_id,
//           employee_id: null, // No employee during repair
//           action: 'repair',
//           details: `Device sent for repair or maintenance`
//         });
  
//         return res.json({ message: 'Device sent for repair or maintenance' });
//       }
  
//       // If not in repair, assign the device to the new employee
//       await deviceModel.assignDevice(parsedData.employee_id, parsedData.device_id);
  
//       // Log assignment action in device history
//       await deviceModel.updateDeviceHistory({
//         device_id: parsedData.device_id,
//         employee_id: parsedData.employee_id,
//         action: 'assigned',
//         details: `Device assigned to employee ${parsedData.employee_id}`
//       });
  
//       res.json({ message: 'Device assigned and status updated' });
//     } catch (error) {
//       console.error('Error in assignDevice:', error);
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ error: error.errors });
//       }
//       res.status(500).json({ error: 'Error updating device' });
//     }
//   };
  

const getDeviceHistory = async (req, res) => {
  try {
    const { device_id } = req.params;

    // Validate device_id
    if (!device_id) {
      return res.status(400).json({ error: 'Device ID is required' });
    }

    // Fetch device history log from the model
    const historyLog = await deviceModel.getDeviceHistory(device_id);

    // If no history found
    if (historyLog.length === 0) {
      return res.status(404).json({ error: 'No history found for this device' });
    }

    res.json({ history: historyLog });
  } catch (error) {
    console.error('Error fetching device history:', error);
    res.status(500).json({ error: 'Error fetching device history' });
  }
};

// module.exports = {
//   getDeviceHistory,
// };

  

module.exports = {
    addDevice,
    updateDevice,
    getDeviceById,
    getAllDevices,
    assignDevice,
    getDeviceHistory
   
};