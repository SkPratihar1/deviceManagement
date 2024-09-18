const { departmentSchema, departmentUpdateSchema } = require('../schemas/department'); // Adjust based on your schema definitions
const departmentModel = require('../models/departmentModel');
const z = require('zod');

// Function to create a new department
const addDepartment = async (req, res) => {
    try {
        const { department_name, description } = req.body;
        
        // Validate the request body using Zod schema (if applicable)
        departmentSchema.parse({ department_name, description });
        
        const newDepartmentId = await departmentModel.addDepartment(department_name, description);
        res.status(201).json({
            message: 'Department created successfully',
            id: newDepartmentId
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
};

// Function to update an existing department
const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate the update data against the Zod schema
        departmentUpdateSchema.parse(updateData);

        await departmentModel.updateDepartment(id, updateData.department_name, updateData.description);

        res.status(200).json({
            message: 'Department updated successfully',
            department: { id, ...updateData },
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
};

// Function to delete a department by ID
const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        await departmentModel.deleteDepartment(id);
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to get a department by ID
const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await departmentModel.getDepartmentById(id);
        if (department) {
            res.status(200).json({
                message: 'Department retrieved successfully',
                department
            });
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to get all departments
const getAllDepartments = async (req, res) => {
    try {
        const departments = await departmentModel.getAllDepartments();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    

    addDepartment,
    updateDepartment,
    getDepartmentById,
    getAllDepartments,
    deleteDepartment
};
