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

    /*deleteMany 
    db.collection('Todos').deleteMany({text:'something'}).then((result)=>{
        console.log(result);
    }); */

    /*deleteOne
    db.collection('Todos').deleteOne({text:'something'}).then((result)=>{
        console.log(result);
    }); */
    //findOneAndDelete -- deletes and returns deleted object
    db.collection('Todos').findOneAndDelete({text:'something'}).then((result)=>{
        console.log(result);
    });
        
    //client.close();
});
