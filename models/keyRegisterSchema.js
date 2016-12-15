var mongoose = require('mongoose');

var keyRegisterSchema = new mongoose.Schema({
  key_register: {
    type: String
    ,unique: true
  },
  used: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Code', keyRegisterSchema);
