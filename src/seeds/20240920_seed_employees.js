
//const { v4: uuidv4 } = require('uuid'); // Importing uuid for UUID generation
const pool = require('../config/db'); 
const { faker } = require('@faker-js/faker');
const employeeModel = require('../models/employeeModel');




async function seed() {
  const department_id = '1'; 
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