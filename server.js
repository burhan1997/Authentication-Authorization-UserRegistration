const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path'); // Import the 'path' module


const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

let userDatabase = [];

// Load user database from file
fs.readFile('userDatabase.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading user database file:", err);
    return;
  }
  try {
    userDatabase = JSON.parse(data);
    console.log("User database loaded successfully.");
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

// Route for user registration
app.post('/register', (req, res) => {
  const newUser = {
    id: uuidv4(),
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  };

  if (!isValidUser(newUser)) {
    res.status(400).send("Invalid User").end();
    return;
  }

  userDatabase.push(newUser);

  // Save user database to file
  saveUserDatabase();

  res.status(201).send({ username: newUser.username, id: newUser.id }).end();
});

const isValidUser = (user) => {
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

  return true;
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
