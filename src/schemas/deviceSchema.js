const { z } = require('zod');

const deviceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  serial_number: z.string().min(1, { message: "Serial number is required" }),
});
const searchSchema = z.object({
  searchTerm: z.string().nonempty("Search term is required").max(100, "Search term is too long"),
});

module.exports = { deviceSchema ,searchSchema};