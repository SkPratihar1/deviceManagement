//import { z } from 'zod';
const {z} =require ('zod')

const assignDeviceSchema = z.object({
  employee_id: z.string().uuid(), // Ensures employee_id is a valid UUID
  device_id: z.string().uuid(),   // Ensures device_id is a valid UUID
});

module.exports = { assignDeviceSchema };