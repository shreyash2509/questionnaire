const express=require('express')
const db=require('./config/db')
const session = require('express-session');
const routes = require('./routes/routes.js');
const bodyParser = require('body-parser');

const PORT=process.env.PORT||8000;

const app=express();

// Configure session middleware
app.use(session({
  secret: 'mySecretKey123',
  resave: false,
  saveUninitialized: true
}));


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

const viewcon=require('./routes/viewsController');
app.use('/', viewcon);
app.use('/api', routes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})