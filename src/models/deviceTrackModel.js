// const pool = require('../config/db');

// // Get the device status to check if it's assigned
// const getDeviceStatus = async (device_id) => {
//     const query = `
//       SELECT assigned_to 
//       FROM devices 
//       WHERE id = $1;
//     `;
//     const values = [device_id];
//     const result = await pool.query(query, values);
  
//     return result.rows[0]; // Returns { assigned_to: number | null }
//   };
  
//   // Assign device to an employee and update status
//   const assignDevice = async (employee_id, device_id) => {
//     const query = `
//       UPDATE devices 
//       SET assigned_to = $1, status = 'Assigned', assigned_date = NOW()
//       WHERE id = $2;
//     `;
//     const values = [employee_id, device_id];
//     await pool.query(query, values);
  
//     // Track assignment in a history table
//     const historyQuery = `
//       INSERT INTO device_history (employee_id, device_id, assigned_date)
//       VALUES ($1, $2, NOW());
//     `;
//     await pool.query(historyQuery, [employee_id, device_id]);
//   };
  
//   const returnDevice = async (device_id) => {
//     const query = `
//       UPDATE devices 
//       SET assigned_to = NULL, status = 'Free', returned_date = NOW()
//       WHERE id = $1;
//     `;
//     await pool.query(query, [device_id]);
//   };
  

//   module.exports = {
//     getDeviceStatus,
//     assignDevice,
//     returnDevice
  
    
// };