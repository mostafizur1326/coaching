const mongoose = require('mongoose');

const eightTHPaymentSchema = new mongoose.Schema({
  student_class: {
    type: String
  },
  student_name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  condition: {
    type: String,
    default: 'off'
  },
  payment_method: {
    type: String,
  },
  sending_number: {
    type: Number
  },
  transection_id: {
    type: String,
    unique: true
  },
  condition2: {
    type: String,
    default: 'off'
  },
  status: {
    type: String,
    default: 'pending',
  },
});

eightTHPaymentSchema.statics.getAllEightTHPayments = function() {
  return this.find();
};

module.exports = mongoose.model('EightthPayment', eightTHPaymentSchema);;