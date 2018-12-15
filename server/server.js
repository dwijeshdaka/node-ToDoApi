require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const port= process.env.PORT || 3000;

app.use(bodyParser.json()); //middleware



app.post('/todos',(req,res)=>{
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    

    todo.save().then((doc) => {
        res.send(doc);
        console.log(doc);
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos',(req,res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id',(req,res) => {
   // res.send(req.params);
   var id = req.params.id;
   if(!ObjectID.isValid(id)){
       return res.status(404).send();
   }

   Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
   }).catch((err)=>res.status(400).send());
});


app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        
        res.send({todo});
    }).catch((err)=>{
        res.status(404).send();
    });
});

app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }
    else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new: true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(404).send();
    });
});


app.post('/users',(req,res)=>{
    var body = _.pick(req.body,['email','password','name']);
    var user = new User(body);
    console.log(body);

    user.save().then(()=>{
        return user.generateAuthToken();
        //res.send(user);
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((err)=>{
        res.status(404).send(err);
    })
});



app.get('/users/me',authenticate,(req,res)=>{
       res.send(req.user);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname+'/index.html');
});


// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    
    var body = _.pick(req.body, ['email', 'password']);
    
    //res.send(body.email + ' Submitted Successfully!');
    
   // console.log(req);
  
    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send('welcome '+user.tokens);
      });
    }).catch((e) => {
      res.status(404).send('Invalid Credentials');
    });
});


app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }),()=>{
        res.status(404).send();
    }
});  

if(!module.parent) {
    app.listen(port,()=>{
        console.log(`Started on port ${port}`);
    });    
}




module.exports={app};