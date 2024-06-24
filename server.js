require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI; // This should be set in your .env file

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Atlas connection setup
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1); // Exit process on connection failure
  }
}

// Function to save customer data to MongoDB
async function saveCustomerData(customerData) {
  try {
    const db = client.db(); // Use the default database from connection string
    const result = await db.collection("customers").insertOne(customerData);
    console.log("Customer data saved successfully:", result.insertedId);
    return result;
  } catch (error) {
    console.error("Error saving customer data:", error);
    throw error; // Throw error for handling in calling function
  }
}

// POST endpoint to save customer data
app.post("/saveCustomer", async (req, res) => {
  const customerData = req.body;

  try {
    const result = await saveCustomerData(customerData);
    res.status(201).json({
      message: "Customer data saved successfully",
      customerId: result.insertedId
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Handle requests to the root path ("/")
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server and connect to MongoDB Atlas
async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

// Call startServer function to start the application
startServer();
