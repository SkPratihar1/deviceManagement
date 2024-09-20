const { z } = require('zod')

const returnDeviceSchema = z.object({
    device_id: z.string().uuid(),
    status: z.enum(["Maintenance","Damage","Return"]).optional()
  });

  module.exports = { returnDeviceSchema };