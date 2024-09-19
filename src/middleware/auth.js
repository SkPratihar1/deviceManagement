// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET_KEY;
// const authorize = (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1]//['authorization']; 
//   //console.log(token)

//   if (!token) {
//     return res.status(403).json({ message: 'Authorization token required' });
//   }

//   try {
   
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded; 
//     next(); 
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid or expired token' });
//   }
// };
// module.exports = { authorize };


const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const authorize = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authorize;



