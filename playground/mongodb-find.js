const {MongoClient, ObjectID} = require('mongodb'); //destructuring



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

    db.collection('Todos').find({completed:'false'}).toArray().then((docs)=>{
        console.log('ToDos');
        console.log(JSON.stringify(docs,undefined,2));
    },(err) => {
        console.log('unable to fetch todos',err);
    });

    db.collection('Todos').count().then((count)=>{
        console.log(`ToDos count ${count}`);
    },(err) => {
        console.log('unable to fetch todos',err);
    });

  
    //client.close();
});
