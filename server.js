const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path'); 
const bcrypt = require('bcrypt');


const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

let userDatabase = [];

// Load user database from file
// Load user database from file
fs.readFile('userDatabase.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading user database file:", err);
    return;
  }
  try {
    userDatabase = JSON.parse(data);
    console.log("User database loaded successfully.");
    
    // Ensure userDatabase is an array
    if (!Array.isArray(userDatabase)) {
      console.error("User database is not in the expected format. Initializing as an empty array.");
      userDatabase = [];
    }
  } catch (err) {
    // Handle invalid JSON or empty file
    if (err instanceof SyntaxError) {
      console.error("Invalid JSON in user database file.");
    } else {
      console.error("Error parsing user database JSON:", err);
    }
    // Initialize user database with an empty array
    userDatabase = [];
  }
});

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

  const newUser = {
    id: uuidv4(),
    username,
    password: hashedPassword, // Store the hashed password
    email
  };

  // Validate the user before saving
  if (!isValidUser(newUser, hashedPassword)) {
    res.status(400).send("Invalid User").end();
    return;
  }

  userDatabase.push(newUser);

  // Save user database to file
  saveUserDatabase();

  res.status(201).send({ username: newUser.username, id: newUser.id }).end();
});

const isValidUser = async (user, hashedPassword) => {
  if (!user.username || !user.password || !user.email) {
    return false;
  }

  // Check if password meets minimum length requirement
  const MIN_PASSWORD_LENGTH = 6;
  if (user.password.length < MIN_PASSWORD_LENGTH) {
    return false;
  }

  // Check if username has been previously registered
  const existingUser = userDatabase.find(existingUser => existingUser.username === user.username);
  if (existingUser) {
    return false;
  }

  // Compare password with hashed password using bcrypt
  return await bcrypt.compare(user.password, hashedPassword);
};



// Function to save user database to file
const saveUserDatabase = () => {
  fs.writeFile('userDatabase.json', JSON.stringify(userDatabase, null, 2), (err) => {
    if (err) {
      console.error("Error saving user database file:", err);
    } else {
      console.log("User database saved successfully.");
    }
  });
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
