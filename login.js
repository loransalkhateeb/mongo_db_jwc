
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
const app = express();

// Database connection configuration
const db = pgp('postgresql://postgres:loransalkhateebyazanalkhateeb123456789@localhost:5432/cleanning_service_db');

// Secret key for JWT
const secretKey = 'your_secret_key';

app.use(bodyParser.json());




  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Retrieve user data from the database based on the provided email
      const user = await db.oneOrNone('SELECT email,password FROM users WHERE email = $1 and password=$2', [email,password]);
      console.log(user)
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      // Verify the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        // Passwords match, create a JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });
  
        res.status(200).json({ token });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
