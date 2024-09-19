//const pool = require('../config/db');
const pool = require('../config/db');

// Function to add a new device
const addDevice = async (name, type, serial_number) => {
    const query = `
        INSERT INTO devices (name, type, serial_number)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const values = [name, type, serial_number];
    const res = await pool.query(query, values);
    return res.rows[0].id;
};

// Function to update an existing device
const updateDevice = async (id, name, type, serial_number) => {
    const query = `
        UPDATE devices
        SET name = $1, type = $2, serial_number = $3
        WHERE id = $4;
    `;
    const values = [name, type, serial_number, id];
    await pool.query(query, values);
};
const getDeviceById = async (id) => {
    const query = 'SELECT * FROM devices WHERE id = $1;';
    const res = await pool.query(query, [id]);
    return res.rows[0];
};

const getAllDevices = async () => {
    const query = 'SELECT * FROM devices;';
    const res = await pool.query(query);
    return res.rows;
};
const getDeviceStatus = async (device_id) => {
    const query = `
      SELECT assigned_to 
      FROM devices 
      WHERE id = $1;
    `;
    const values = [device_id];
    const result = await pool.query(query, values);
  
    return result.rows[0]; 
  };



  const getDeviceBySerial = async (serial_number) => {
    // Query to check if a device with the given serial number exists
    const query = `SELECT * FROM devices WHERE serial_number = $1`;
    const values = [serial_number];
    const result = await pool.query(query, values);
    return result.rows[0];
  };

  

  const assignDevice = async (employee_id, device_id) => {
    const query = `
      UPDATE devices 
      SET assigned_to = $1, status = 'Assigned', assigned_date = NOW()
      WHERE id = $2;
    `;
    const values = [employee_id, device_id];
    await pool.query(query, values);
  };
  
  // Add a new function for inserting into device history
  const historyQuery = async ({ employee_id, device_id, action, details }) => {
    const historyQuery = `
      INSERT INTO device_history (employee_id, device_id, action, details, assigned_date)
      VALUES ($1, $2, $3, $4, NOW());
    `;
    const historyValues = [employee_id, device_id, action, details];
    await pool.query(historyQuery, historyValues);
  };
  


  const getDeviceHistory = async (device_id) => {
    const query = `
      SELECT dh.device_id, dh.action, dh.details, dh.assigned_date, 
             e.id as employee_id, e.name as employee_name, e.team_id,
             d.name as device_name
      FROM device_history dh
      JOIN employees e ON dh.employee_id = e.id
      JOIN devices d ON dh.device_id = d.id
      WHERE dh.device_id = $1
      ORDER BY dh.assigned_date DESC;
    `;
    const result = await pool.query(query, [device_id]);
    return result.rows;
  };
  const searchDevices = async (searchTerm) => {
    const query = `
        SELECT * FROM devices
        WHERE name ILIKE $1 OR type ILIKE $1 OR serial_number ILIKE $1;
    `;
    const values = [`%${searchTerm}%`]; // Safely parameterized query
    const res = await pool.query(query, values);
    return res.rows;
};


module.exports = {
    addDevice,
    updateDevice,
    getDeviceById,
    getAllDevices,
    assignDevice,
    historyQuery,
    getDeviceStatus,
    getDeviceBySerial,
    getDeviceHistory,
    searchDevices
   
    
};
