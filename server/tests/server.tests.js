const expect = require('expect');
const request = require('supertest');
var {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'first todo'
    },{
    _id: new ObjectID(),
    text: 'second todo',
    completed : true,
    completedAt: 333
    }];

beforeEach((done) => {
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos);
    }).then(()=>done());
});

describe('POST /todos',() =>{
    it('Should create a new todo',(done)=>{
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res) => {
                if (err){
                    return done(err);
                }
                Todo.find({text}).then((todos) =>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err)=>done(err));
            });
    });

    it('Should not create a todo with invalid body data',(done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res) => {
                if (err){
                    return done(err);
                }
                Todo.find().then((todos) =>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err)=>done(err));
            });
    });
});


describe('GET /todos',() => {
    it('Should get all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('Get /todos/:id',()=>{
    it('Should return todo doc',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return a 404 error if todo not found',(done)=>{
        var hexID = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it('Should return a 404 error for non-object ids',(done)=>{
        
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/id:',()=>{
    it('Should remove a todo by ID',(done)=>{
        var hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexID)
            }).end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.findById(hexID).then((todo)=>{
                    expect(!todo);
                    done();
                }).catch((err)=>done(err));
            });
    });

    it('Should return a 404 error if todo not found',(done)=>{
        var hexID = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it('Should return a 404 error for non-object ids',(done)=>{
        
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id',()=>{
    it('Should update todo',(done)=>{
        var hexID = todos[0]._id.toHexString();
        var text = 'This is new todo';
        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                completed: true,
                text: text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');

            })
            .end(done);
    });

    it('Should clear completedAt when todo is not completed',(done)=>{
        var hexID = todos[1]._id.toHexString();
        var text = 'This is new todo with false';
        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                completed: false,
                text: text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(!res.body.todo.completedAt);

            })
            .end(done);
    });
});