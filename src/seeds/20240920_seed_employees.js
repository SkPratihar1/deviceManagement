// const pool = require('../config/db');

// async function seed() {
//   await pool.query(`
//     INSERT INTO employees (name, email, status)
//     VALUES ('John Doe', 'john@example.com', 'active'),
//            ('Jane Doe', 'jane@example.com', 'inactive');
//   `);
// }

// module.exports = { seed };


const { v4: uuidv4 } = require('uuid'); // Importing uuid for UUID generation
const pool = require('../config/db'); // Assuming db.js is in config directory
const { faker } = require('@faker-js/faker'); // Importing Faker.js to generate fake data
const employeeModel = require('../models/employeeModel');




async function seed() {
  const department_id = '1'; // Replace with the actual static department ID

  const client = await pool.connect();
  //console.log('Current Database:', client.database);
  try {
    await client.query('BEGIN'); // Start transaction

    for (let i = 0; i < 1; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email(firstName, lastName);
      const phone = faker.phone.number();
      const status = faker.helpers.arrayElement(['Active', 'Inactive']);
      const name = `${firstName} ${lastName}`;

      //console.log(`Creating employee: ${name}, Email: ${email}, Phone: ${phone}, Status: ${status}`);

      // Use the createEmployee function
      await employeeModel.createEmployee(name, email, phone, department_id, status);
    }

    await client.query('COMMIT'); // Commit transaction
    console.log('Employees have been successfully inserted into the database.');
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error('Error inserting employees:', error);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

module.exports = { seed };