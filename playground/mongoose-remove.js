const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

var id = '5bf2f68057934d1ef8a1f3e6';

/*
// .remove({})
Todo.remove({}).then((res)=>{
    console.log(res);
});  */

//findOneAndRemove()

Todo.findByIdAndRemove({_id:'5bf5844db0b831c45df8863a'}).then((res)=>{
    
});


//findByIdAndRemove()

Todo.findByIdAndRemove('5bf5844db0b831c45df8863a').then((res)=>{
    console.log(res);
});