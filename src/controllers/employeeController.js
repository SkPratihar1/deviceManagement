
const employeeModel = require('../models/employeeModel');

const createEmployee = async (req, res) => {
    try {
        const { name, email, phone, team_id, status } = req.body;
        const newEmployeeId = await employeeModel.createEmployee(name, email, phone, team_id, status);
        res.status(201).json({
            message: 'Employee created successfully',
            id: newEmployeeId
        })
        //res.status(201).json({ id: newEmployeeId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, team_id, status } = req.body;
        await employeeModel.updateEmployee(id, name, email, phone, team_id, status);
        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        await employeeModel.deleteEmployee(id);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await employeeModel.getEmployeeById(id);
        if (employee) {
            res.status(200).json({
                message: 'Employee retrieved successfully',
                employee
            });
            //res.status(200).json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.getAllEmployees();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getAllEmployees
};
