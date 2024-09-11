const bcrypt = require('bcrypt');
const pool = require('../config/db');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const result = await pool.query('SELECT * FROM administrator WHERE email = $1', [email]);
    const user = result.rows[0];
    console.log("result1",user)

    if (!user) {
      console.log("sdalha")
      return res.status(401).json({ error: 'Unauthorized' });
    }

    
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { login };
