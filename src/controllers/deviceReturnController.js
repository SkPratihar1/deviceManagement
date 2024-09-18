const {z} =require ('zod');
const { returnDeviceSchema } = require('../schemas/returnDeviceSchema'); 
const deviceReturnModel = require('../models/deviceReturnModel'); 

// const returnDevice = async (req, res) => {
//   try {
//     const parsedData = returnDeviceSchema.parse(req.body);

//     // Get current device status
//     const deviceStatus = await deviceReturnModel.getDeviceStatus(parsedData.device_id);

//     if (!deviceStatus) {
//       return res.status(404).json({ error: 'Device not found' });
//     }

//     if (!deviceStatus.assigned_to) {
//       return res.status(400).json({ error: 'Device is not currently assigned' });
//     }

//     let newStatus = parsedData?.status==="Return"? "Available": parsedData.status;

//     // Log return action in device history
//     await deviceReturnModel.updateDeviceHistory({
//       device_id: parsedData.device_id,
//       employee_id: deviceStatus.assigned_to,
//       action: newStatus,
//       details: `Device returned by employee ${deviceStatus.assigned_to}`
//     });

//     // Determine the new status of the device
//     //let newStatus = 'Available';
//     // if (parsedData.status === 'Damage') {
//     //   newStatus = 'Maintenance';
//     //   await deviceReturnModel.updateDeviceHistory({
//     //     device_id: parsedData.device_id,
//     //     employee_id: deviceStatus.assigned_to,
//     //     action: 'maintenance',
//     //     details: `Device returned due to damage and sent for maintenance`
//     //   });
//     // }

//     // Update device status and unassign it
//     await deviceReturnModel.updateDeviceStatus(parsedData.device_id, newStatus);
//     // await deviceReturnModel.unassignDevice(parsedData.device_id);

//     res.json({ message: 'Device returned and status updated' });
//   } catch (error) {
//     console.error('Error in returnDevice:', error);
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ error: error.errors });
//     }
//     res.status(500).json({ error: 'Error returning device' });
//   }
// };

// module.exports = {
 
//   returnDevice
// };


const returnDevice = async (req, res) => {
  try {
    const parsedData = returnDeviceSchema.parse(req.body);

    // Get current device status
    const deviceStatus = await deviceReturnModel.getDeviceStatus(parsedData.device_id);

    if (!deviceStatus) {
      return res.status(404).json({ error: 'Device not found' });
    }

    if (!deviceStatus.assigned_to) {
      return res.status(400).json({ error: 'Device is not currently assigned' });
    }

    // Determine the new status
    let newStatus = parsedData?.status === "Return" ? "Available" : parsedData.status;

    // Check if the last logged action in the history is the same as the new action
    const lastHistoryEntry = await deviceReturnModel.getLastHistoryEntry(parsedData.device_id);
    
    if (lastHistoryEntry && lastHistoryEntry.action === newStatus) {
      return res.status(400).json({ error: `Device is already in status: ${newStatus}` });
    }

    // Log return action in device history if not duplicate
    await deviceReturnModel.updateDeviceHistory({
      device_id: parsedData.device_id,
      employee_id: deviceStatus.assigned_to,
      action: newStatus,
      details: `Device returned by employee ${deviceStatus.assigned_to}`
    });

    // Update device status and unassign it
    await deviceReturnModel.updateDeviceStatus(parsedData.device_id, newStatus);

    res.json({ message: 'Device returned and status updated' });
  } catch (error) {
    console.error('Error in returnDevice:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Error returning device' });
  }
};

module.exports = {
  returnDevice
};
