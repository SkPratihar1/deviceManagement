// const { z } = require('zod');

// const employeeSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email format"),
//   phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be at most 15 digits"),
//   department_id: z.number().int().positive("Team ID must be a positive integer"),
//   status: z.enum(['Active', 'Inactive'], "Status must be 'Active' or 'Inactive'")
// });
// const employeeUpdateSchema = z.object({
//   name: z.string().optional(),
//   email: z.string().email().optional(),
//   phone: z.string().min(10).max(15).optional(),
//   department_id: z.number().int().positive().optional(),
//   status: z.enum(['Active', 'Inactive']).optional()
// });
// module.exports = { employeeSchema ,employeeUpdateSchema};

const { z } = require('zod');

// Define schema for creating an employee
const employeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    department_id: z.number().int().nonnegative().optional(), // Updated to department_id
    status: z.string().optional()
});

// Define schema for updating an employee
const employeeUpdateSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().min(10, "Phone number must be at least 10 characters").optional(),
    department_id: z.number().int().nonnegative().optional(), // Updated to department_id
    status: z.string().optional()
});

module.exports = {
    employeeSchema,
    employeeUpdateSchema
};
