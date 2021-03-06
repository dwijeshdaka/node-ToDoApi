const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt =  require('jsonwebtoken');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();


const users = [{
    _id : userOneID,
    email : 'dwijesh.daka@gmail.com',
    password : 'dwijesh',
    tokens : [{
    access : 'auth',
    token : jwt.sign({_id: userOneID, access: 'auth',},'secret').toString() }]
},{
    _id : userTwoID,
    email : 'user2@gmail.com',
    password : 'dwijeshdaka'
}];

const todos = [{
    _id: new ObjectID(),
    text: 'first todo'
    },{
    _id: new ObjectID(),
    text: 'second todo',
    completed : true,
    completedAt: 333
    }];




const populateTodos = (done) => {
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos);
    }).then(()=>done());
};

const populateUsers = (done) => {
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne,userTwo])

    }).then(()=>done());
};

module.exports = {todos,populateTodos,users,populateUsers};