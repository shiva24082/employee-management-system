const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
    enum: [
      'IT', 'HR', 'Finance', 'Marketing', 
      'Operations', 'Sales', 'Other'
    ]
  },
  position: {
    type: String,
    required: [true, 'Please add a position']
  },
  salary: {
    type: Number,
    required: [true, 'Please add a salary'],
    min: [0, 'Salary cannot be negative']
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'on leave', 'terminated'],
    default: 'active'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', EmployeeSchema);