var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true, //find methods in mongoosejs.com/docs
        minLength: 1,
        trim: true,
        unique: true,
        validate:{
            //validator: validator.isEmail,    
            
            validator :(value)=>{
                return validator.isEmail(value);
            },
            message: "{VALUE} is not a valid email"
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    },
    tokens:[{
        access:{
            type: String,
            required: true,    
        },
        token:{
            type: String,
            required: true,    
        }
    }]
});

UserSchema.methods.toJSON = function (){
    var user = this;
    var userObj = user.toObject();
    
    return _.pick(userObj,['_id','email']);
};

UserSchema.methods.generateAuthToken = function (){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'secret').toString();
    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(()=>{
        return token;
    }); 
};


UserSchema.statics.findByToken = function (token){
    var User= this;
    var decoded='';

    try{
        decoded = jwt.verify(token,'secret');
    }catch(err){
        // return new Promise((resolve,reject)=>{
        //     reject();
        // });

        return Promise.reject();
    }
     return User.findOne({
          '_id': decoded._id,
          'tokens.token': token,
          'tokens.access': 'auth'

      });

     //console.log(test);
    // return decoded;

};


var User = mongoose.model('User',UserSchema);

module.exports = {User};