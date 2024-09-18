const pool = require('../config/db');

const createEmployee = async (name, email, phone, department_id, status) => {
    const query = `
        INSERT INTO employees (name, email, phone, department_id, status)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
    `;
    const values = [name, email, phone, department_id, status];
    const res = await pool.query(query, values);
    return res.rows[0].id;
};

// const updateEmployee = async (id, name, email, phone, team_id, status) => {
//     const query = `
//         UPDATE employees
//         SET name = $1, email = $2, phone = $3, team_id = $4, status = $5
//         WHERE id = $6;
//     `;
//     const values = [name, email, phone, team_id, status, id];
//     await pool.query(query, values);
// };


const checkDuplicateEmployee = async (email, phone, id) => {
    const query = `
      SELECT * FROM employees 
      WHERE (email = $1 OR phone = $2) 
      AND id != $3
    `;
    const values = [email, phone, id];
    const { rows } = await pool.query(query, values);
    return rows.length > 0;
  };
  
  const updateEmployee = async (id, name, email, phone, department_id, status) => {
    const query = `
      UPDATE employees
      SET name = $1, email = $2, phone = $3, department_id = $4, status = $5
      WHERE id = $6;
    `;
    const values = [name, email, phone, department_id, status, id];
    await pool.query(query, values);
  };

const deleteEmployee = async (id) => {
    const query = 'DELETE FROM employees WHERE id = $1;';
    await pool.query(query, [id]);
};

const getEmployeeById = async (id) => {
    const query = 'SELECT * FROM employees WHERE id = $1;';
    const res = await pool.query(query, [id]);
    return res.rows[0];
};

const getAllEmployees = async () => {
    const query = 'SELECT * FROM employees;';
    const res = await pool.query(query);
    return res.rows;
};

module.exports = {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getAllEmployees,
    checkDuplicateEmployee
};
