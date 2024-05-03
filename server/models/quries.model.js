const mongoose = require('mongoose');

// Define the schema for the query
const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

// Create a Mongoose model based on the schema
const query = mongoose.model('query', querySchema);

module.exports = query;
