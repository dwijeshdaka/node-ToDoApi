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

    db.collection('Todos').findOneAndUpdate({
        text : 'lunch'
    },
    {
        $set : {
            completed: true
        }
    },{
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    });

        
    //client.close();
});
