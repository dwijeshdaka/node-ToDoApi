const {SHA256} = require('crypto-js');


/* Without JWT
var msg = 'Im number'
console.log(SHA256(msg).toString());

var data = {
    id:4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data)+'secret').toString()
}

//token.data.id = 5;
//token.hash =  SHA256(JSON.stringify(token.data.id)).toString();


var hashRes = SHA256(JSON.stringify(token.data)+'secret').toString();
if(hashRes === token.hash){
    console.log('Data was not changed');
}
else{
    console.log('Data is changed!! Do not TRUST!');
}   */

//with JWT

const jwt = require('jsonwebtoken');

var data = {
    id:4
};

var token = jwt.sign(data,'secret');
console.log(token);

var decoded = jwt.verify(token,'secret');
console.log('decoded : ',decoded);