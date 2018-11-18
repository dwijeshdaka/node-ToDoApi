//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb'); //destructuring

/* to get object id
var obj=new ObjectID();
console.log(obj);
*/

var user = {name:'Dwijesh',age:'21'};
var {name} = user;
console.log(name);
// if mongo is latest to avoid depreciation message { useNewUrlParser: true }
MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true },(err,client) =>{
    if(err){
        console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongodb');
    const db = client.db('TodoApp');

   /* db.collection('Todos').insertOne({
        text : 'something',
        completed : 'false'
    },(err,result) => {
        if(err){
        return console.log('Unable to insert todo',err);
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    });
    
    db.collection('users').insertOne({
        name : 'dwijesh',
        age : '21',
        location : 'vizag'
    },(err,result) => {
        if(err){
        return console.log('Unable to insert user',err);
        }
        console.log(JSON.stringify(result.ops,undefined,2));

        console.log(result.ops[0]._id.getTimestamp());
    }); */

    client.close();
});
