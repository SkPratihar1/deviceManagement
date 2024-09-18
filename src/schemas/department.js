const { z } = require('zod');

// Define schema for creating a department
const departmentSchema = z.object({
    department_name: z.string().min(1, "Department name is required"),
    description: z.string().optional() // description is optional
});

// Define schema for updating a department
const departmentUpdateSchema = z.object({
    department_name: z.string().min(1, "Department name is required").optional(),
    description: z.string().optional()
});

module.exports = {
    departmentSchema,
    departmentUpdateSchema
};
