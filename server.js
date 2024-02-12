const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

let userDatabase = [];
const sessions = {};

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

// Route for user registration
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
  if (!isValidUser(newUser)) {
    res.status(400).send("Invalid User").end();
    return;
  }

  userDatabase.push(newUser);

  // Save user database to file
  saveUserDatabase();

  res.status(201).send({ username: newUser.username, id: newUser.id }).end();
});

// Route for user login
// Route for user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate username and password
  const user = userDatabase.find(user => user.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid username / password combination' });
  }

  // Generate a unique session ID
  const sessionId = crypto.randomBytes(16).toString('hex');

  // Associate session ID with the username
  sessions[sessionId] = username;

  // Send session ID as part of the response
  res.status(200).json({ sessionId }); // Include session ID in the response
});


// Middleware to authenticate requests using session ID
app.use((req, res, next) => {
  const sessionId = req.headers['session-id']; // Assuming session ID is sent in the request headers
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Add authenticated user information to the request object
  req.user = { username: sessions[sessionId] };
  next();
});

// Example authenticated route
app.get('/profile', (req, res) => {
  // Access authenticated user information from req.user
  const username = req.user.username;
  res.status(200).json({ message: `Welcome, ${username}!` });
});

// Function to validate user input before registration
const isValidUser = (user) => {
  // Your validation logic goes here
  return true; // Placeholder
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
