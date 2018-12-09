const jwt = require('jsonwebtoken');
const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

var pass='dwijesh123'
bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(pass,salt,(err,hash)=>{
        console.log(hash);
    })
});  //no of rounds is 10

var hashPwd= '$2a$10$HKicb6.jPRoPzFqM7Ha0a.N.vuuztFvceHNOe7icuRSV3spf0EtqS';

bcrypt.compare(pass,hashPwd,(err,res)=>{
    console.log(res);
})