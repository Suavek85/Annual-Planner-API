const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex') 

const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'krejzole33',
      database : 'annualplanner'
    }
  });

db.select('*').from('users').then(data => {

console.log(data);

})

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {

    users: [

        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'apples',
            entries: []
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'cookies',
            entries: []
        }

    ],

    login: [

        {"id": '986', "hash": "", "email": "john@gmail"}

    ]

}


//GET ALL USERS FROM THE DATABASE

app.get('/', (req, res) => {

    res.send(database.users)

})



//POST ROUTE FOR SIGN IN

app.post('/signin', (req, res) => {


    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password)

    {
       
        res.json(database.users[0].entries)
    } 
    else {
        res.status(400).json('error logging in')
    }

})


//POST ROUTE FOR REGISTER

app.post('/register', (req, res) => {

    const {email, name, password} = req.body;

    db('users')
    .returning('*')
    .insert({

    name: name,
    email: email,
    entries: []
    })
    
    .then(user=> {

        res.json(user[0]);
    })

    .catch(err => res.status(404).json('Unable to register'))

})



//POST ROUTE FOR REGISTER
/*
app.post('/register', (req, res) => {

    const {email, name, password} = req.body;

    database.users.push(

        {
            id: 123,
            name: name,
            email: email,
            password: password,
            entries: []
        }

    )

    res.json('register worked')

})

*/

//UPDATE MAIN ARRAY (SUBMIT AND SAVE AND CLOSE)

app.post('/todos', (req, res) => {

    const {id} = req.body; //problem
    
    let found = false;

db.where('id', '=', id)
.update( {

entries: req.body.entries


})

.returning('entries')
.then()

    /*
    database.users.forEach(user => {

    
        if (user.id === id) {
            found = true;
            user.entries = req.body.entries
            return res.json(user.entries);

        } 

    })

    */

        if(!found) {

            res.status(404).json('not found');
        }


} )
















//UPDATE MAIN ARRAY (SUBMIT AND SAVE AND CLOSE)
/*
app.post('/todos', (req, res) => {

    const {id} = req.body;
    
    let found = false;

    database.users.forEach(user => {

    
        if (user.id === id) {
            found = true;
            user.entries = req.body.entries
            return res.json(user.entries);

        } 

    })

        if(!found) {

            res.status(404).json('not found');
        }


} )

*/
//EXTRA

app.get('/profile/:id', (req, res) => {

    const {id} = req.params;
    
    let found = false;

    database.users.forEach(user => {

    
        if (user.id === id) {
            found = true;
            return res.json(user);

        } 

    })

        if(!found) {

            res.status(404).json('not found');
        }
   
})


app.listen(3000)

