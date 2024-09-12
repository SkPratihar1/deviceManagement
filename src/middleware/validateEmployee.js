const { employeeSchema } = require('../schemas/employeeSchema');
const { ZodError } = require('zod');

const validateEmployee = (req, res, next) => {
  try {
    
    req.body = employeeSchema.parse(req.body);
    next(); 
  } catch (error) {
    if (error instanceof ZodError) {
      
      return res.status(400).json({ errors: error.errors });
    }
    
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { validateEmployee };
