const expect = require('expect');
const request = require('supertest');
var {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe('GET /users/me', ()=>{
    it('Should return user if authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
    });

    it('Should return 401 if user not authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            }).end(done);
    });

describe('POST /users',()=>{
    it('Should create a user',(done)=>{
        var email = 'test1@gmail.com';
        var password = 'testpassword1';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist;
                expect(res.body_id).toExist;
                expect(res.body.email).toBe(email);
            }).end((err)=>{
                if(err){
                    return done(err);
                }
                else {
                User.findOne({email}).then((user)=>{
                    expect(user).toExist;
                    expect(user.password).not.toBe(password);
                    done();
                });
            }
            });
    });

    it('Should return validation errors if invalid request',(done)=>{
        request(app)
            .post('/users')
            .send({
                email:'and',
                password: 'abc'})
            .expect(404)
            .end(done);

    });

    it("Should not create user if email already in use",(done)=>{
        request(app)
            .post('/users')
            .send({
                email : users[0].email,
                password : '123'
            })
            .expect(404)
            .end(done);
    });
});

});