var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  profile: {
    admin: {
      type: Boolean
    }
    ,username: {
      type: String
      ,required: true
      ,lowercase: true
      ,unique: true
    }
    ,firstname: {
      type: String
      ,required: true
    }
    ,lastname: {
      type: String
      ,required: true
    }
    ,password: {
      type: String
      ,required: true
    }
    ,mail:{
      type: String
      ,required: true
    }
    ,created: {
      type: Date
      ,default: Date.now
    }
    ,updated: {
      type: Date
      ,default: Date.now
    }
  }
});

module.exports = mongoose.model('User', userSchema);
