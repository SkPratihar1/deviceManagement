const { employeeUpdateSchema  } = require('../schemas/employeeSchema');
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
      const updateData = req.body;
  
      // Validate the update data against the Zod schema
      employeeUpdateSchema.parse(updateData);
  
      const { email, phone } = updateData;
  
     
      const isDuplicate = await employeeModel.checkDuplicateEmployee(email, phone, id);
  
      if (isDuplicate) {
        return res.status(400).json({ error: 'Email or phone number already exists for another employee.' });
      }
  
      
      await employeeModel.updateEmployee(id, updateData.name, email, phone, updateData.team_id, updateData.status);
  
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

module.exports = {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getAllEmployees
};


// const { employeeSchema } = require('../schemas/employeeSchema');
// const employeeModel = require('../models/employeeModel');

// const createEmployee = async (req, res) => {
//   try {
//     // Validate employee data using Zod
//     const validatedData = employeeSchema.parse(req.body);

//     const { name, email, phone, team_id, status } = validatedData;
//     const newEmployeeId = await employeeModel.createEmployee(name, email, phone, team_id, status);

//     res.status(201).json({
//       message: 'Employee created successfully',
//       id: newEmployeeId
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       // Handle validation errors from Zod
//       return res.status(400).json({ errors: error.errors });
//     }
//     res.status(500).json({ error: error.message });
//   }
// };



// const updateEmployee = async (req, res) => {
//   try {
   
//     const validatedData = employeeSchema.parse(req.body);

//     const { id } = req.params;
//     const { name, email, phone, team_id, status } = validatedData;
//     await employeeModel.updateEmployee(id, name, email, phone, team_id, status);

//     res.status(200).json({ message: 'Employee updated successfully' });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       // Handle validation errors from Zod
//       return res.status(400).json({ errors: error.errors });
//     }
//     res.status(500).json({ error: error.message });
//   }
// };
// const deleteEmployee = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await employeeModel.deleteEmployee(id);
//         res.status(200).json({ message: 'Employee deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const getEmployeeById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const employee = await employeeModel.getEmployeeById(id);
//         if (employee) {
//             res.status(200).json({
//                 message: 'Employee retrieved successfully',
//                 employee
//             });
//             //res.status(200).json(employee);
//         } else {
//             res.status(404).json({ message: 'Employee not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const getAllEmployees = async (req, res) => {
//     try {
//         const employees = await employeeModel.getAllEmployees();
//         res.status(200).json(employees);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// module.exports = {
//   createEmployee,
//   updateEmployee,
//   deleteEmployee,
//   getEmployeeById,
//   getAllEmployees
// };
