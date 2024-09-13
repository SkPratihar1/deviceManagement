//import { z } from 'zod';
const {z} =require ('zod')

 const assignDeviceSchema = z.object({
  employee_id: z.number().int().positive(), // Ensures employee_id is a positive integer
  device_id: z.number().int().positive(),   // Ensures device_id is a positive integer
})


module.exports = { assignDeviceSchema };