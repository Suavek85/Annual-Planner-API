const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')

const db = knex ({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true,
    }
  });

db.select('*').from('users').then(data => {

console.log(data);

})

const app = express();

app.use(bodyParser.json());
app.use(cors());


//POST ROUTE FOR SIGN IN

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) } )


//POST ROUTE FOR REGISTER

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })


//UPDATE MAIN ARRAY ON SUBMIT AND SAVE-CLOSE)

app.post('/todos', (req, res) => { profile.handleProfile (req, res, db) } )



//EXTRA FOR PROFILE

/*

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
*/

app.listen(process.env.PORT || 3000)

