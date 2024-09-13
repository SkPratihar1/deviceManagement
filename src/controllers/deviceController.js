
const deviceModel = require('../models/deviceModel');
const { assignDeviceSchema } =  require('../schemas/assignDeviceSchema');
//import { z } from 'zod';
const {z} =require ('zod')
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
    try {
      const parsedData = assignDeviceSchema.parse(req.body); // Ensure `assignDeviceSchema` is correctly imported
  
      // Check device status
      const deviceStatus = await deviceModel.getDeviceStatus(parsedData.device_id);
  
      if (deviceStatus && deviceStatus.assigned_to) {
        return res.status(400).json({ error: 'Device is already assigned to another employee' });
      }
  
      // Assign the device
      await deviceModel.assignDevice(parsedData.employee_id, parsedData.device_id);
  
      res.json({ message: 'Device assigned and status updated' });
    } catch (error) {
      console.error('Error in assignDevice:', error); // Detailed error logging
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Error assigning device' });
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
