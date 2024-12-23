const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = "your_jwt_secret_key";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://vsk60419:20212090@cluster0.qvevo6f.mongodb.net/transactions", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error", err));
  
  const authMiddleware = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.userId = decoded.userId; // Pass userId to the next middleware
      next();
    } catch (err) {
      res.status(400).send("Invalid token.");
    }
  };
  

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    money: Number,
    transactionType: String,
    context: String,
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// Routes
app.patch('/transaction/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send("User created successfully");
    } catch (err) {
        res.status(400).send("Error signing up: " + err.message);
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Invalid credentials");
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).send("Error logging in: " + err.message);
    }
});

app.post("/transaction", async (req, res) => {
    const { token, name, money, transactionType, context } = req.body;
    try {
        const { userId } = jwt.verify(token, SECRET_KEY);
        const newTransaction = new Transaction({ userId, name, money, transactionType, context });
        await newTransaction.save();
        res.status(201).send("Transaction saved");
    } catch (err) {
        res.status(400).send("Error saving transaction: " + err.message);
    }
});

app.post("/transaction", authMiddleware, async (req, res) => {
    const { name, money, transactionType, context } = req.body;
    try {
      const newTransaction = new Transaction({
        userId: req.userId,
        name,
        money,
        transactionType,
        context,
      });
      await newTransaction.save();
      res.status(201).send("Transaction saved");
    } catch (err) {
      res.status(400).send("Error saving transaction: " + err.message);
    }
  });
  
  app.get("/transactions", authMiddleware, async (req, res) => {
    try {
      const transactions = await Transaction.find({ userId: req.userId });
      res.json(transactions);
    } catch (err) {
      res.status(400).send("Error fetching transactions: " + err.message);
    }
  });
  
app.get("/download", async (req, res) => {
    const { token } = req.headers;
    try {
        const { userId } = jwt.verify(token, SECRET_KEY);
        const transactions = await Transaction.find({ userId });
        const fields = ['name', 'money', 'transactionType', 'context', 'date'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(transactions);
        res.header('Content-Type', 'text/csv');
        res.attachment('transactions.csv');
        res.send(csv);
    } catch (err) {
        res.status(500).send("Error downloading transactions: " + err.message);
    }
});

// Listen
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));