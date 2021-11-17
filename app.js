const express = require("express");   //To import express modules which contains functions/objects.
const path = require("path");   //Imports path module that allows you to interact with file paths easily.
const fs = require("fs");       //File system: used to import files.
const app = express();      //Creates new express app.
const port = 80;        //Home port.
var mongoose = require('mongoose');     //Imports mongoose module.
const bodyparser = require('body-parser');       //Install body-parser from terminal. It helps to get the body of entered data from user.


mongoose.connect('mongodb://localhost/contactDance', {useNewUrlParser: true});  //We wish to create a new db called contactDance.


//Mongoose specific
//var db = mongoose.connection;       //New db named connection.

//mongoose.connect('mongodb://localhost/contactDance');       



//Database
//mongoose schema
var contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    number: String,
    address: String,
    about: String,
});

var Contact = mongoose.model('Contact', contactSchema);          
//Creating model here, contacts (mongo autonames to plural) is a table.



// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'))    //For serving static files
app.use(express.urlencoded())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory
 
// ENDPOINTS
app.get('/', (req, res)=>{
    const params = {}
    res.status(200).render('home.pug', params);
})
app.get('/contact', (req, res)=>{
    const params = {}
    res.status(200).render('contact.pug', params);
})


app.post('/contact', (req, res)=>{
    var myData = new Contact(req.body);       //Table(model) named "contact" is already created above.
    //New contact object is created via req.body
    myData.save().then(()=>{
        res.send('Item saved to DB.')       //The save function returns promise. Thus, we use .then; 
    }).catch(()=>{
        res.status(400).send("Item not saved.")
    })
    // res.status(200).render('contact.pug');
})
//Install body parser using npm install body-parser to save posts using express.


app.post('/contact', (req, res)=>{
    name = req.body.name
    email = req.body.email
    number = req.body.number
    address = req.body.address
    about = req.body.about

    let outputToWrite = `The name of the client is "${name}" \nEmail is "${email}"\nPhone no is "${number} "\nAddress- "${address}" \nCondition and goals: "${about}"`
    fs.writeFileSync('output.txt', outputToWrite)
    const params = {'message': 'Your form has been submitted successfully'}
    res.status(200).render('contact.pug', params);
    
})



// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});