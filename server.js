const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MongoDB connection
const uri = 'mongodb+srv://ngeninnovations2023:Ngen.2024@cluster0.t8znmzv.mongodb.net/lakeapp';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Define a schema and model
const Schema = mongoose.Schema;
const DataSchema = new Schema({
  photoUris: [String],
  lake: [Object],
  userId: String,
  updated: { type: Date, default: Date.now }
}, { collection: 'lake' });

const Data = mongoose.model('Data', DataSchema);

// API endpoints
app.post('/save', async (req, res) => {
  const newData = new Data(req.body);
  try {
    await newData.save();
    res.status(201).json(newData);
    console.log('Data saved successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});