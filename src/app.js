const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); 
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();


app.use(express.json());


app.use(express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Welcome to the Employee Management API');
});


app.use('/auth', authRoutes);

app.use(bodyParser.json());

app.use('/employees', employeeRoutes);

app.use('/devices', deviceRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
