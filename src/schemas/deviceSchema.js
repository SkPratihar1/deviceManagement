const { z } = require('zod');

const deviceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  serial_number: z.string().min(1, { message: "Serial number is required" }),
});

module.exports = { deviceSchema };