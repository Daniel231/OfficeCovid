const mongoose = require('mongoose');

const WorklogSchema = new mongoose.Schema({
  Type: {
    type: String,
    enum: ['Arrived', 'Left'],
    required: [true, 'You have to choose log type']
  },
  date: {
    type: Date,
    required: [true, "Work log must have date"],
    default: Date.now
  },
  employeeNumber:  {
    type: String,
    required: [true, "Work log must have employee number"],
  },
}, {timestamps: true});

const Worklog = mongoose.model('Worklog', WorklogSchema);

module.exports = Worklog;