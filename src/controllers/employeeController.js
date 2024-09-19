const { employeeUpdateSchema,searchSchema ,employeeQuerySchema } = require('../schemas/employeeSchema');
const employeeModel = require('../models/employeeModel');



const createEmployee = async (req, res) => {
    try {
        const { name, email, phone, department_id, status } = req.body;

        // Check if the email or phone already exists
        const isDuplicate = await employeeModel.checkDuplicateEmployee(email, phone);

        if (isDuplicate) {
            return res.status(400).json({ error: 'Email or phone number already exists for another employee.' });
        }

        // Create the new employee if no duplicates are found
        const newEmployeeId = await employeeModel.createEmployee(name, email, phone, department_id, status);
        res.status(201).json({
            message: 'Employee created successfully',
            id: newEmployeeId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


  
  const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate the update data against the Zod schema
        employeeUpdateSchema.parse(updateData);

        const { email, phone } = updateData;

        // Check for duplicate email or phone, excluding the current employee's own record
        const isDuplicate = await employeeModel.checkDuplicateEmployee(email, phone, id);

        if (isDuplicate) {
            return res.status(400).json({ error: 'Email or phone number already exists for another employee.' });
        }

        // Update the employee if no duplicates are found
        await employeeModel.updateEmployee(id, updateData.name, email, phone, updateData.department_id, updateData.status);

        res.status(200).json({
            message: 'Employee updated successfully',
            employee: { id, ...updateData },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
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



const searchEmployees = async (req, res) => {
    try {
        const { searchTerm } = searchSchema.parse(req.query);

        const employees = await employeeModel.searchEmployees(searchTerm);
        res.status(200).json({
            message: 'Employees retrieved successfully',
            employees
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
};



const getEmployeesFromDB = async (req, res) => {
    try {
        // Preprocess the status to handle empty string case
        const { status, ...otherQueryParams } = req.query;
        // console.log("req.body", req.body)
        const parsedStatus = status && status.trim().length > 0 ? status : undefined; // Remove empty status

        // Validate query params using Zod
        const validation = employeeQuerySchema.parse({ ...otherQueryParams, status: parsedStatus });

        // Extract validated query params
        const { name, email, department_name, page = 1, limit = 10 } = validation;

        // Calculate pagination
        const offset = (page - 1) * limit;

        // Get employees from model
        const employees = await employeeModel.getEmployeesFromDB({
            name, email, department_name, status: parsedStatus, limit, offset
        });

        // Return response
        if (employees.length === 0) {
            return res.status(200).json({ message: 'No employees found', data: [] });
        }

        res.json({ message: 'Employees found', page, limit, data: employees });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ errors: error.errors });
        }
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getAllEmployees,
    //getEmployees,
    getEmployeesFromDB,
    searchEmployees
};

