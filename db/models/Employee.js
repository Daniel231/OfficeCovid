const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "employee first name can't be blank"],
  },
  lastName: {
    type: String,
    required: [true, "employee last name can't be blank"],
  },
  email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "employee must have email adress"],
      match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  employeeNumber: {
    type: String,
    unique: true,
    required: [true, "employee must have employee string"],
  },
  isSick: {
    type: Boolean,
    default: false,
  }
}, {timestamps: true});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;