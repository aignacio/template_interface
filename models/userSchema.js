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
    ,name: {
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
    ,phone:{
      type: Number
      ,required: true
    }
    ,hash_recover:{
      type: String
    }
    ,hash_register:{
      type: String
      ,unique: true
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
