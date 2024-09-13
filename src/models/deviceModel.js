
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

//   const updateDeviceHistory = async ({ device_id, employee_id, action, details }) => {
//     const query = `
//       INSERT INTO device_history (device_id, employee_id, action, details, timestamp)
//       VALUES ($1, $2, $3, $4, NOW())`;
//     const values = [device_id, employee_id || null, action, details];
//     await pool.query(query, values);
//   };
  
//   const assignDevice = async (employee_id, device_id) => {
//     const query = `
//       UPDATE devices
//       SET assigned_to = $1, assigned_date = NOW()
//       WHERE id = $2`;
//     const values = [employee_id, device_id];
//     await pool.query(query, values);
//   };
  
//   const unassignDevice = async (device_id) => {
//     const query = `
//       UPDATE devices
//       SET assigned_to = NULL, assigned_date = NULL
//       WHERE id = $1`;
//     const values = [device_id];
//     await pool.query(query, values);
//   };
  

  
  
  const assignDevice = async (employee_id, device_id) => {
    const query = `
      UPDATE devices 
      SET assigned_to = $1, status = 'Assigned', assigned_date = NOW()
      WHERE id = $2;
    `;
    const values = [employee_id, device_id];
    await pool.query(query, values);
  
    // Track assignment in a history table
    const historyQuery = `
      INSERT INTO device_history (employee_id, device_id, assigned_date)
      VALUES ($1, $2, NOW());
    `;
    await pool.query(historyQuery, [employee_id, device_id]);
  };
  
//   const returnDevice = async (device_id) => {
//     const query = `
//       UPDATE devices 
//       SET assigned_to = NULL, status = 'Free', returned_date = NOW()
//       WHERE id = $1;
//     `;
//     await pool.query(query, [device_id]);
//   };
module.exports = {
    addDevice,
    updateDevice,
    getDeviceById,
    getAllDevices,
    assignDevice,
    getDeviceStatus,
    // updateDeviceHistory,
    // unassignDevice 
    // returnDevice
    
    
};


// module.exports = {
//     addDevice,
//     updateDevice ,
//     // deleteEmployee,
//     // getEmployeeById,
//     // getAllEmployees
// };

// const getEmployeeById = async (id) => {
//     const query = 'SELECT * FROM employees WHERE id = $1;';
//     const res = await pool.query(query, [id]);
//     return res.rows[0];
// };

// const getAllEmployees = async () => {
//     const query = 'SELECT * FROM employees;';
//     const res = await pool.query(query);
//     return res.rows;
// };