const { z } = require('zod')

const returnDeviceSchema = z.object({
    device_id: z.number().int(),
    status: z.enum(["Maintenance","Damage","Return"]).optional()
  });

  module.exports = { returnDeviceSchema };