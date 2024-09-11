
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');


router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.get('/', employeeController.getAllEmployees);

module.exports = router;
