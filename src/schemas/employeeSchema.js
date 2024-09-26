

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

const searchSchema = z.object({
  searchTerm: z.string().nonempty("Search term is required").max(100, "Search term is too long"),
});

const employeeQuerySchema = z.object({
    name: z.string().optional(),  // Optional name field
    email: z.string().optional(), // Optional email field
    department_name: z.string().optional(), // Optional department_name field
    status: z.enum(['Active', 'Inactive']).or(z.string().max(0)).optional(), // Optional status field
    page: z.preprocess(val => Number(val), z.number().int().optional()), // Optional page, cast to number
    limit: z.preprocess(val => Number(val), z.number().int().optional()) // Optional limit, cast to number
});
module.exports = {
    employeeSchema,
    employeeUpdateSchema,
    employeeQuerySchema ,
    searchSchema
};
