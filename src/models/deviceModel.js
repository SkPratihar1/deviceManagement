
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
const assignDevice = async (employee_id, device_id) => {
    // Update device with employee ID
    const updateDeviceQuery = `
      UPDATE devices SET employee_id = $1 WHERE id = $2
    `;
    await pool.query(updateDeviceQuery, [employee_id, device_id]);
  
    // Insert into device history
    const insertHistoryQuery = `
      INSERT INTO device_history (device_id, employee_id) VALUES ($1, $2)
    `;
    await pool.query(insertHistoryQuery, [device_id, employee_id]);
  };
module.exports = {
    addDevice,
    updateDevice,
    getDeviceById,
    getAllDevices,
    assignDevice
    
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