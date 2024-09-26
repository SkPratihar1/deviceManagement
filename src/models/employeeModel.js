const pool = require('../config/db');

// const createEmployee = async (name, email, phone, department_id, status) => {
//     const query = `
//         INSERT INTO public.employees (name, email, phone, department_id, status)
//         VALUES ($1, $2, $3, $4, $5) RETURNING id;
//     `;
//     const values = [name, email, phone, department_id, status];
//     console.log('Executing query:', query, 'with values:', values);
//     const res = await pool.query(query, values);
   
//     console.log('Current database:', res.rows[0]);   
//     return res.rows[0].id;
// };
const createEmployee = async (name, email, phone, department_id, status) => {
  const query = `
      INSERT INTO employees (name, email, phone, department_id, status)
      VALUES ($1, $2, $3, $4, $5) RETURNING id;
  `;
  const values = [name, email, phone, department_id, status];
  
  
  const client = await pool.connect(); // Use a new client for this query
  console.log("client",client)
  try {
      const res = await client.query(query, values);
      console.log('Inserted employee ID:', res.rows[0].id);
      return res.rows[0].id;
  } catch (error) {
      console.error('Error executing query:', error);
      throw error; // Re-throw the error to be caught in the seed function
  } finally {
      client.release(); // Release the client back to the pool
  }
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


// const checkDuplicateEmployee = async (email, phone, id) => {
//     const query = `
//       SELECT * FROM employees 
//       WHERE (email = $1 OR phone = $2) 
//       AND id != $3
//     `;
//     const values = [email, phone, id];
//     const { rows } = await pool.query(query, values);
//     return rows.length > 0;
//   };

  const checkDuplicateEmployee = async (email, phone, id = null) => {
    let query = `
      SELECT * FROM employees 
      WHERE (email = $1 OR phone = $2)
    `;

    const values = [email, phone];

    // If an `id` is provided, exclude this employee from the check (useful during updates)
    if (id) {
        query += ` AND id != $3`;
        values.push(id);
    }

    const { rows } = await pool.query(query, values);
    return rows.length > 0; // Return true if a duplicate exists
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
//Function to search employees by email or name
// const searchEmployees = async (searchTerm) => {
//   // Use a parameterized query to prevent SQL injection
//   const query = `
//       SELECT * FROM employees
//       WHERE email ILIKE $1 OR name ILIKE $2;
//   `;
//   // Use wildcards for partial matches
//   const values = [`%${searchTerm}%`, `%${searchTerm}%`];
//   const res = await pool.query(query, values);
//   return res.rows;
// };


const searchEmployees = async (searchTerm) => {
  const query = `
      SELECT * FROM employees
      WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1;
  `;
  const values = [`%${searchTerm}%`];
  const res = await pool.query(query, values);
  return res.rows;
};


// const getEmployeesFromDB = async ({ name, email, department_id, department_name, status, limit, offset }) => {
//   // Query to fetch employees and their department names
//   let query = `
//       SELECT e.id, e.name, e.email, e.department_id, d.department_name, e.status
//       FROM employees e
//       LEFT JOIN department d ON e.department_id = d.id
//       WHERE (COALESCE($1, '') = '' OR e.name ILIKE '%' || $1 || '%')
//         AND (COALESCE($2, '') = '' OR e.email ILIKE '%' || $2 || '%')
//         AND (COALESCE($3, '')::INTEGER = 0 OR e.department_id = COALESCE($3, '')::INTEGER)
//         AND (COALESCE($4, '') = '' OR e.status = $4::employee_status)
//         AND (COALESCE($5, '') = '' OR d.department_name ILIKE '%' || $5 || '%')
//       LIMIT $5 OFFSET $6
//   `;

//   // Values to be used in the query placeholders
//   const values = [name, email, department_id,department_name, status, limit, offset];

//   try {
//       // Execute the query
//       const result = await pool.query(query, values);
//       // Return rows of the result
//       return result.rows;
//   } catch (err) {
//       console.error('Database query error:', err);
//       throw err;
//   }
// };
const getEmployeesFromDB = async ({ name, email, department_name, status, limit, offset }) => {
  // SQL query, filtering based on name, email, status, and department_name
  let query = `
      SELECT e.id, e.name, e.email, d.department_name, e.status
      FROM employees e
      LEFT JOIN department d ON e.department_id = d.id
      WHERE (COALESCE($1, '') = '' OR e.name ILIKE '%' || $1 || '%')
        AND (COALESCE($2, '') = '' OR e.email ILIKE '%' || $2 || '%')
        AND (COALESCE($3, '') = '' OR e.status = $3::employee_status)
        AND (COALESCE($4, '') = '' OR d.department_name ILIKE '%' || $4 || '%')
      LIMIT $6 OFFSET $5
  `;

  // Ensure limit and offset are integers
  const values = [name, email, status, department_name, parseInt(offset, 10), parseInt(limit, 10)];

  try {
      // Execute the query
      const result = await pool.query(query, values);
      return result.rows;
  } catch (err) {
      console.error('Database query error:', err);
      throw err;
  }
};


module.exports = {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getAllEmployees,
    checkDuplicateEmployee,
    searchEmployees,
    getEmployeesFromDB
};
