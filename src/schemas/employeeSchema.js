const { z } = require('zod');

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be at most 15 digits"),
  team_id: z.number().int().positive("Team ID must be a positive integer"),
  status: z.enum(['Active', 'Inactive'], "Status must be 'Active' or 'Inactive'")
});
const employeeUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  team_id: z.number().int().positive().optional(),
  status: z.enum(['Active', 'Inactive']).optional()
});
module.exports = { employeeSchema ,employeeUpdateSchema};

