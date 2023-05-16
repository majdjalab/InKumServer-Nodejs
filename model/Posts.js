const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
  
  var Posts = new Schema({
    username: {
    },
    title: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    url: {
        type: String
    },
    price: {
        type: String
    },
    phone: {
        type: String
    },
});

Posts.plugin(passportLocalMongoose);
  
module.exports = mongoose.model('Posts', Posts)