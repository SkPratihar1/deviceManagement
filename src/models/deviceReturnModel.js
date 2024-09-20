const pool = require('../config/db'); // Update with your actual db connection file

// Update device status
const updateDeviceStatus = async (device_id, status) => {
  const query = `
    UPDATE devices 
    SET status = $2
    WHERE id = $1;
  `;
  await pool.query(query, [device_id, status]);
};

// Unassign device
const unassignDevice = async (device_id) => {
  const query = `
    UPDATE devices 
    SET employee_id = NULL
    WHERE id = $1;
  `;
  await pool.query(query, [device_id]);
};

// Log device history
const updateDeviceHistory = async ({ device_id, employee_id, action, details }) => {
  const query = `
    INSERT INTO device_history (device_id, employee_id, action, details,assigned_date)
    VALUES ($1, $2, $3, $4, NOW());
  `;
  await pool.query(query, [device_id, employee_id, action, details]);
};

// Get device status
const getDeviceStatus = async (device_id) => {
  const query = `
    SELECT employee_id, status
    FROM devices
    WHERE id = $1;
  `;
  const result = await pool.query(query, [device_id]);
  return result.rows[0];
};

const getLastHistoryEntry = async (device_id) => {
  const query = `
    SELECT action FROM device_history
    WHERE device_id = $1
    ORDER BY assigned_date DESC
    LIMIT 1;
  `;
  const result = await pool.query(query, [device_id]);
  return result.rows[0];
};
module.exports = {
   
    unassignDevice,
    updateDeviceHistory,
    updateDeviceStatus,
    getDeviceStatus,
    getLastHistoryEntry

    
    
};