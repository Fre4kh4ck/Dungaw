/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db.js');
const verifyToken = require('./middlewares/verifyToken.js');
const multer = require('multer');
const upload = multer(); // memory storage by default



const server = express();
const host = 'http://dungaw.ua';
const port = 4435;

server.use(express.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cors({
  origin: ['http://localhost:5173', 'http://dungaw.ua:5173'],
  credentials: true
}));
server.use(express.static('uploads'));


//Get ka Event

server.get('/events', async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT * FROM addevent ORDER BY EventDate ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});


//Event Post, sakit na likod ko sir 
server.post('/addevent/add', upload.single('photo'), async (req, res) => {
  const task = req.body;
  const file = req.file;

  console.log("📥 Body:", task);
  console.log("📸 File:", file);

  const sql = `
    INSERT INTO addevent (EventName, EventTime, EventDate, EventVenue, EventDescription, EventPhoto, EventDept)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await db.pool.query(sql, [
    task.title,
    task.time,
    task.date,
    task.venue,
    task.description,
    file ? file.originalname : null,
    task.dept
  ]);

  res.json({ success: true });
});


//Protect Endpoint 
server.get('/adminEvents', verifyToken, async (req, res) => {
  try {
    res.json({
      success: true,
      message: `Access granted to ${req.user.username}`,
      user: req.user,
    });
  } catch (err) {
    console.error('Error in /adminEvents:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error' });
  }
});
//JWT token nga darwa ka adlaw gin problemahan

const jwt = require('jsonwebtoken'); 

server.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", username, password);

    const [rows] = await db.pool.query(
      "SELECT * FROM accounts WHERE account_username = ? AND account_password = ?",
      [username, password]
    );

    const user = Array.isArray(rows) ? rows[0] : rows;
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    console.log("DB result:", user);

    const payload = {
      id: user.account_id,
      username: user.account_username,
      role: user.account_type,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      message: "Login successful",
      token,
      role: user.account_type.trim(),
      user: {
        id: user.account_id,
        username: user.account_username,
        role: user.account_type.trim(),
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


//GET By Juswa

server.get('/accounts/order/id', async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM accounts ORDER BY account_id ASC");
    const data = Array.isArray(result[0]) ? result[0] : result;
    res.json(data);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).json({ error: err.message });
  }
});

//Edit Account 
server.put('/accounts/edit', async (req, res) => {
  try {
    const task = req.body;

    const [result] = await db.pool.query(
      "UPDATE accounts SET account_username = ?, account_password = ? WHERE account_id = ?",
      [task.username, task.password, task.id]
    );

    console.log("Update result:", result);
    res.json({ message: "Account updated successfully!" });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ message: "Failed to update account" });
  }
});

//Delete Account 

server.post('/accounts/delete', async (req, res) => {
  try {
    console.log('Request body:', req.body);

    const { id } = req.body;

    const [result] = await db.pool.query(
      'DELETE FROM accounts WHERE account_id = ?',
      [id]
    );

    console.log('Deleted:', result);

    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


//Search ka mga Event

//Sakit sa likod tak an ako Sir

server.post('/account/search', async (req, res) => {
  try {
    const { department, role } = req.body;

    const depKeyword = `%${department || ''}%`;
    const roleKeyword = `%${role || ''}%`;

    console.log("Searching accounts:", depKeyword, roleKeyword);

    const [rows] = await db.pool.query(
      `SELECT * FROM accounts 
       WHERE LOWER(account_name) LIKE LOWER(?) 
          OR LOWER(account_type) LIKE LOWER(?)`,
      [depKeyword, roleKeyword]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error searching accounts:", err);
    res.status(500).json({ error: err.message });
  }
});

server.post('/accounts/post', async (req, res) => {
  try {
    const task = req.body;
    const result = await db.pool.query(
      'INSERT INTO accounts (account_name, account_username, account_password, account_type, account_creation) VALUES (?, ?, ?, ?, ?)',
      [
        task.name,
        task.username,
        task.password,
        task.role,
        task.creation
      ]
    );

    console.log(result);
    res.json({ success: true, insertedId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}); 

server.listen(port, () => console.log(`API server is now running at ${host}:${port}`));
