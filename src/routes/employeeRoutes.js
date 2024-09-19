

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authorize = require('../middleware/auth');

// Define routes
router.post('/create', authorize, employeeController.createEmployee);
router.put('/update/:id', authorize, employeeController.updateEmployee);
router.delete('/delete/:id', authorize, employeeController.deleteEmployee);
router.get('/search', authorize, employeeController.searchEmployees);
router.get('/:id', authorize, employeeController.getEmployeeById);
//router.get('/', authorize, employeeController.getAllEmployees);
router.get('/', authorize, employeeController.getEmployeesFromDB);

module.exports = router;
