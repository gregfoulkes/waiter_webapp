// call express
var express = require('express')
var exphbs = require('express-handlebars');
var app = express();

//flash setup

let flash = require('express-flash');
let session = require('express-session');

//setup middleware
var bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json())

app.use(flash());

app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));

//connect to postgres database
var postgres = require('pg')
const Pool = postgres.Pool

let useSSL = false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:1234@localhost:5432/waiter_shifts'

const pool = new Pool({
  connectionString,
  ssl: useSSL
})

//start the server

let PORT = process.env.PORT || 5008;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});

//Handlebars setup

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    flashMessage: function () {
      if (this.messages.info == "Shift(s) successfully added!") {
        return "success";
      } else {
        return "failure";
      }
    }
  }
}));

app.set('view engine', 'handlebars');

//call factory function

const WaiterApp = require('./waiter_webapp.js');
const Waiter = WaiterApp(pool);

app.get('/', async function (req, res, next) {
  res.render('login')
})

app.post('/login', async function (req, res, next) {

  let name = req.body.waiterName

let checkName = await Waiter.checkWaiter(name)
  try {
    if(checkName){
      res.redirect('/waiters/' + name)

    }if(!checkName){
      req.flash('register', 'Please register your name')

    }

    // if()

    
  } catch (err) {
    return next(err)
  }
})

app.post('/register', async function (req, res, next){
  let fullName = req.body.fullName
  let userName = req.body.userName

  console.log(userName)
  console.log(fullName)

  try {

    let params = {
      full_name: fullName,
      user_name: userName
    }

    console.log(params)
    
    await Waiter.addWaiter(params)
    res.redirect('')

  } catch (err) {
    return next(err)
  }

})

app.get('/waiters/:username', async function (req, res, next) {

  let username = req.params.username

  try {
    let foundUser = await Waiter.returnChecked(username);
    //console.log(foundUser)
    res.render('waiter_webapp', {
      days: await Waiter.getWeekdays(username),
      username,
      foundUser

    })
  } catch (err) {
    return next(err)
  }
});

app.post('/waiters/:username', async function (req, res, next) {

  let name = req.params.username

  try {

    if(name){

    let foundUser = await Waiter.returnChecked(name);

    let getDays = await Waiter.getWeekdays(name)

    let shiftData = {
      user_name: name,
      day_names: Array.isArray(req.body.dayName) ? req.body.dayName : [req.body.dayName]
    };
    let added = await Waiter.selectShift(shiftData)

    if(added){
      req.flash('info', 'succesfully added shift(s)')
    }

    }

    res.redirect('/waiters/' + req.params.username);

  } catch (err) {
    return next(err)
  }

});

app.get('/days', async function (req, res, next) {

  try {
    let shifts = await Waiter.getDaysAndNames()
    res.render('days', {
      shifts
    })
  } catch (err) {

    return next(err)
  }

});

app.get('/clear', async function (req, res, next) {

  try {
    //let getDays = await Waiter.getWeekdays()
    await Waiter.deleteShifts()
    res.redirect('/days')

  } catch (err) {
    return next(err)
  }

})