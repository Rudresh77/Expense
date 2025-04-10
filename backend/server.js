require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { poolPromise, sql } = require('./config/db');


const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reportRoutes = require('./routes/reportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'mysecretkey', 
  resave: false,
  saveUninitialized: false, 
  cookie: { secure: false, maxAge: 3600000 }
}));

app.use('/api/dashboard', dashboardRoutes);



app.use(express.static(path.join(__dirname, '../frontend'))); 
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));  
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));


app.use((req, res, next) => {
  if (req.path.endsWith('.css')) res.type('text/css');
  if (req.path.endsWith('.js')) res.type('application/javascript');
  next();
});


app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);

app.get('*', (req, res) => {
  if (req.path.startsWith('/assets/') || req.path.startsWith('/pages/')) {
    return res.status(404).send('File not found');
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/') && !req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in again." });
  }
  next();
});

// async function initializeDatabase() {
//   try {
//     const pool = await poolPromise;

//     // Create Users table if it does not exist
//     await pool.request().query(`
//       IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
//       BEGIN
//         CREATE TABLE Users (
//           Id INT IDENTITY(1,1) PRIMARY KEY,
//           Name VARCHAR(100),
//           Email VARCHAR(100) UNIQUE,
//           Password VARCHAR(255)
//         )
//       END
//     `);

    
//     // Create Expenses table if it does not exist
//     await pool.request().query(`
//       IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Expenses')
//       BEGIN
//         CREATE TABLE Expenses (
//           Id INT IDENTITY(1,1) PRIMARY KEY,
//           UserId INT,
//           Title VARCHAR(255),
//           Amount DECIMAL(18,2),
//           Category VARCHAR(100),
//           Date DATE,
//           Notes VARCHAR(255)
//         )
//       END
//     `);

//     // Create Categories table if it does not exist
//     await pool.request().query(`
//       IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Categories')
//       BEGIN
//         CREATE TABLE Categories (
//           Id INT IDENTITY(1,1) PRIMARY KEY,
//           UserId INT,
//           Name VARCHAR(100),
//           Color VARCHAR(50)
//         )
//       END
//     `);

//     console.log("Database tables ensured.");
//   } catch (error) {
//     console.error("Error initializing database tables:", error);
//   }
//}


// initializeDatabase();
