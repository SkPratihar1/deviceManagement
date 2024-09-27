// const bcrypt = require('bcrypt');
// const pool = require('../config/db');

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
    
//     const result = await pool.query('SELECT * FROM administrator WHERE email = $1', [email]);
//     const user = result.rows[0];
//     console.log("result1",user)

//     if (!user) {
//       console.log("sdalha")
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

    
//     const match = await bcrypt.compare(password, user.password);

//     if (match) {
//       res.status(200).json({ message: 'Login successful' });
//     } else {
//       res.status(401).json({ error: 'Unauthorized' });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// module.exports = { login };

const bcrypt = require('bcryptjs');

// Usage remains the same

//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');


const JWT_SECRET =process.env.JWT_SECRET_KEY ; 

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const result = await pool.query('SELECT * FROM administrator WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      
      const token = jwt.sign(
        { userId: user.id, email: user.email }, // payload data
        JWT_SECRET,
        { expiresIn: '1h' } // token expiration time
      );

      
      res.status(200).json({
        message: 'Login successful',
        token: token
      });
    } else {
      res.status(401).json({ error: 'Unauthorized: Invalid password' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { login };
