const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


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


//POST ROUTE FOR SIGN IN

app.post('/signin', (req, res) => {


    db.select('email', 'hash').from('login')
    
    .where('email', '=', req.body.email)
    
    .then(data =>{

    const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
   

   if ( isValid ) {
    return db.select('*')
    .from('users')
    .where('email', '=', req.body.email)
    .then(user => {console.log(user[0]); res.json(user[0])} )
    .catch(err => res.status(400).json('unable to get user'))

   } else {

    res.status(400).json('wrong credentials')

   }

    })

    .catch(err => res.status(400).json('wrong credentials'))

})


//POST ROUTE FOR REGISTER

app.post('/register', (req, res) => {

    const {email, name, password} = req.body;

    const hash = bcrypt.hashSync(password);
db.transaction(trx => {

trx.insert({

hash: hash,
email: email

})

.into('login')
.returning('email')
.then(loginEmail => {

    return trx('users')
    .returning('*')
    .insert({

    name: name,
    email: loginEmail[0],
    entries: []
    })
    
    .then(user=> {

        res.json(user[0]);
    })


})

.then(trx.commit)
.catch(trx.rollback)

})
 
    .catch(err => res.status(404).json('Unable to register'))

})


//UPDATE MAIN ARRAY (SUBMIT AND SAVE AND CLOSE)

app.post('/todos', (req, res) => {

    const {id} = req.body; 
    
    //let found = false;

 db('users').where('id', '=', id)
.update( {

entries: req.body.entries

})

.returning('entries')
.then(entries => {

res.json(entries);

})


.catch(err => res.status(400).json('unable to get entries'))


        //if(!found) {

            //res.status(404).json('not found');
        //}


} )



//EXTRA FOR PROFILE

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

/*

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
*/

