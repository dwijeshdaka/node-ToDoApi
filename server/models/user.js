var mongoose = require('mongoose');


var User = mongoose.model('User',{
    email : {
        type: String,
        required: true, //find methods in mongoosejs.com/docs
        minLength: 1,
        trim: true
    }
});

module.exports = {User};