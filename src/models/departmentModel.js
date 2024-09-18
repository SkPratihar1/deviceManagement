// Import the database pool
const pool = require('../config/db');

// Function to add a new department
const addDepartment = async (department_name, description) => {
    const query = `
        INSERT INTO department (department_name, description)
        VALUES ($1, $2)
        RETURNING id;
    `;
    const values = [department_name, description];
    const res = await pool.query(query, values);
    return res.rows[0].id;
};

// Function to update an existing department
const updateDepartment = async (id, department_name, description) => {
    const query = `
        UPDATE department
        SET department_name = $1, description = $2
        WHERE id = $3;
    `;
    const values = [department_name, description, id];
    await pool.query(query, values);
};

// Function to get a department by its ID
const getDepartmentById = async (id) => {
    const query = 'SELECT * FROM department WHERE id = $1;';
    const res = await pool.query(query, [id]);
    return res.rows[0];
};

// Function to get all departments
const getAllDepartments = async () => {
    const query = 'SELECT * FROM department;';
    const res = await pool.query(query);
    return res.rows;
};

// Function to delete a department by its ID
const deleteDepartment = async (id) => {
    const query = 'DELETE FROM department WHERE id = $1;';
    await pool.query(query, [id]);
};

// Export all the department-related functions
module.exports = {
    addDepartment,
    updateDepartment,
    getDepartmentById,
    getAllDepartments,
    deleteDepartment
};
