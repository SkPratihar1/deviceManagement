const pool = require('../config/db');

const checkDuplicateEmployee = async (req, res, next) => {
    const { email, phone } = req.body;

    try {
       
        const emailCheck = await pool.query('SELECT * FROM employees WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(409).json({ error: 'Employee with this email already exists' });
        }

        
        const phoneCheck = await pool.query('SELECT * FROM employees WHERE phone = $1', [phone]);
        if (phoneCheck.rows.length > 0) {
            return res.status(409).json({ error: 'Employee with this phone number already exists' });
        }

        next(); 
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { checkDuplicateEmployee };
