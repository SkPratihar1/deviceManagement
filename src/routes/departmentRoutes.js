const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const departmentController = require('../controllers/departmentController');

// Create a new department
router.post('/add', departmentController.addDepartment);

// Get all departments
router.get('/', departmentController.getAllDepartments);

// Get department by ID
router.get('/:id', departmentController.getDepartmentById);

// Update a department by ID
router.put('/update/:id', departmentController.updateDepartment);

// Delete a department by ID
router.delete('/delete/:id', departmentController.deleteDepartment);

module.exports = router;
