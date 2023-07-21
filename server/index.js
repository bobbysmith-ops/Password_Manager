const express = require('express')
const app =  express()
const PORT = 3001
//const mysql = require('mysql') -----IMPORTANT BUGFIX------
const mysql = require('mysql2')
const cors = require('cors')

const {encrypt,decrypt} = require("./EncryptionHandler")


app.use(cors());
app.use(express.json());

//use this variable to make all the sql queries to our database (ie. select, insert, etc.)
//object passed in contains properties that define our connection to our database
//user is usually just root
//host is localhost since we're hosting the mysql server on our local machine
//database is the schema we created in mysql workbench
const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Mongoose101!',
    database: 'passwordmanager'
})


app.post('/addpassword', (req,res) =>{
    const {password, title} = req.body
    const hashedPassword = encrypt(password)

    //IMPORTANT, this is where we can write any SQL query to insert into our sql database
    //first bracket is columns i want to insert into, second is the values i want to insert, use the question marks to insert our variables
    //the stuff we grab from the query is err and result, result would contain values from a SELECT statement or messages from the query
    db.query("INSERT INTO passwords (password, title, iv) VALUES (?,?,?)",
    [hashedPassword.password, title, hashedPassword.iv],
    (err,result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("Success");
        }
    }
    )
})

//the data received from the database is going to be contained in the result variable
//the we use our res variable from the get request to send that data to the front end
app.get('/showpasswords',(req,res)=> {
    db.query('SELECT * FROM passwords;', (err,result)=>{
        if (err){
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.post('/decryptpassword', (req,res)=>{
    res.send(decrypt(req.body))
})


//react application is running on port 3000 so have to run on a diff port
app.listen(PORT, ()=>{
    console.log("Server is running")
})

