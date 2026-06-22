const express = require('express');
const cors = require('cors');
const db = require('./db'); 
require('dotenv').config();

const app = express();

// 1. Middleware
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

// --- ROUTES ---
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Add your Secret Key to .env

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents ($10.00 = 1000)
      currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [user] = await db.query('SELECT id, name, role FROM Users WHERE email = ? AND password = ?', [email, password]);
        if (user.length > 0) res.json(user[0]);
        else res.status(401).json({ message: "Invalid email or password" });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// Fetch Available Properties
// Fetch ALL Properties (so frontend can filter into Available vs Booked)
app.get('/api/properties', async (req, res) => {
    try {
        // REMOVE 'WHERE status = "Available"' to send all data
        const [rows] = await db.query('SELECT * FROM Properties');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Property (Owner)
app.post('/api/properties', async (req, res) => {
    const { owner_id, title, description, price, location } = req.body;
    try {
        await db.query('INSERT INTO Properties (owner_id, title, description, price, location, status) VALUES (?, ?, ?, ?, ?, "Available")', 
        [owner_id, title, description, price, location]);
        res.status(201).json({ message: "Property listed!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// IMPORTANT: Updated Booking + Automatic Payment
app.post('/api/book', async (req, res) => {
    const { property_id, tenant_id, amount } = req.body;
    try {
        // 1. Create the Booking record
        const [result] = await db.query(
            'INSERT INTO Bookings (property_id, tenant_id) VALUES (?, ?)', 
            [property_id, tenant_id]
        );

        // 2. CRITICAL: Update the Property status so the Dashboard can see it's rented
        // If this line is missing, the house stays in "Marketplace" and never moves to "My Rented"
        await db.query(
            'UPDATE Properties SET status = "Booked" WHERE id = ?', 
            [property_id]
        );

        // 3. Create the Payment record
        await db.query(
            'INSERT INTO Payments (booking_id, amount, status) VALUES (?, ?, "Completed")', 
            [result.insertId, amount]
        );

        res.json({ message: "Success! Property is now Booked." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Payment History (Tenant) - Crash Proof
app.get('/api/payments/tenant/:tenantId', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT pay.*, p.title 
             FROM Payments pay
             INNER JOIN Bookings b ON pay.booking_id = b.id
             INNER JOIN Properties p ON b.property_id = p.id
             WHERE b.tenant_id = ?`, [req.params.tenantId]);
        res.json(rows);
    } catch (err) {
        console.error("History Error:", err.message);
        res.status(500).json({ error: "Table missing or SQL Error. Check MySQL Workbench." });
    }
});

// Maintenance Requests
app.post('/api/maintenance', async (req, res) => {
    const { property_id, tenant_id, description } = req.body;
    try {
        await db.query('INSERT INTO Maintenance_Requests (property_id, tenant_id, description, status) VALUES (?, ?, ?, "Pending")', 
        [property_id, tenant_id, description]);
        res.json({ message: "Request sent!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/maintenance/owner/:ownerId', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT m.*, p.title FROM Maintenance_Requests m 
             JOIN Properties p ON m.property_id = p.id 
             WHERE p.owner_id = ?`, [req.params.ownerId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get all bookings for properties owned by a specific Owner
app.get('/api/bookings/owner/:ownerId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.id as booking_id, b.booking_date, u.name as tenant_name, u.email as tenant_email, p.title, p.price
       FROM Bookings b
       JOIN Properties p ON b.property_id = p.id
       JOIN Users u ON b.tenant_id = u.id
       WHERE p.owner_id = ?`, [req.params.ownerId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/maintenance/owner/:ownerId', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT m.*, p.title, u.name as tenant_name 
             FROM Maintenance_Requests m 
             JOIN Properties p ON m.property_id = p.id 
             JOIN Users u ON m.tenant_id = u.id
             WHERE p.owner_id = ?`, [req.params.ownerId]);
        
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/api/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // Insert new user
    await db.query(
      'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));