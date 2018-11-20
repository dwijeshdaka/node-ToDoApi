const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5bf2f68057934d1ef8a1f3e6';

/*
console.log(ObjectID.isValid(id));
if(ObjectID.isValid(id)){
    console.log('Invalid ID')
}


Todo.find({
    _id : id
}).then((todos)=>{
    console.log('Todos',todos);
});

Todo.findOne({
    _id : id
}).then((todo)=>{
    console.log('Todo',todo);
});   */

Todo.findById(id).then((todo)=>{
    if(!todo){
        return console.log('Invalid Id');
    }
    console.log('Todo by id',todo);
}).catch((err)=>console.log(err)); 

User.findById('5bf2dd4f34f1951c10bc546d').then((user)=>{
    if(!user){
        return console.log('Unable to find user');
    }
    console.log(user);
}).catch((err)=>console.log(err)); 