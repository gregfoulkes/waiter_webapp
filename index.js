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


app.use(function(req, res, next){



  // if ( (req.path === '/' || req.path === 'login')) {
  //   return next();
  // }  
  
  // if(!req.session.user_name) {
  //   req.flash('register', 'Please login')
  //   return res.redirect('/');
  // }
  next();

});

const WaiterApp = require('./waiter_webapp.js');
const Waiter = WaiterApp(pool);

app.get('/', async function (req, res, next) {
  res.render('login')
})

app.post('/login', async function (req, res, next) {

  let name = req.body.waiterName
  let admin = req.body.adminName
let checkName = await Waiter.checkWaiter(name)

//console.log(checkName)
  try {
   

    if(checkName){
      //
      req.session.user_name = name;
      return res.redirect('/waiters/' + name)

    }
    
    if(checkName == false){
      req.flash('register', 'Please register your name');
      return res.redirect('/');
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

  let params = {
    full_name: fullName,
    user_name: userName
  }


  try {
    const errors = [];
    if( fullName == ''){

      errors.push('Please Enter your Full Name')
    }


    if(userName == ''){
      errors.push('Please Enter a Username')
    }
    console.log(errors)
    if (errors.length > 0) {
      req.flash('errors', errors);
      res.redirect('/')
    }


    // do work here as we have all the data

        console.log(params)
        
        let registerTrue = await Waiter.addWaiter(params)
        if(registerTrue){
          req.flash('registered', 'Succesfully Registered')
          res.redirect('/')

        }
        //req.flash('invalid', 'Please Enter a User Name')
  } catch (err) {
    return next(err)
  }

})

function checkAccess(req, res, next) {
  if (req.session.user_name !== req.params.username) {
    req.flash('errors', 'Access denied');
    return res.redirect('/');
  }
  next();
}


app.get('/waiters/:username', checkAccess, async function (req, res, next) {

  


  try {

    let username = req.params.username

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

app.get('/signout', function(req, res) {
  delete req.session.user_name;
  res.redirect('/');
});


async function isAdmin(req, res, next){
  let admin = req.body.adminName

  let checkAdmin = await Waiter.isAdmin(admin)
  if(checkAdmin){
      let shifts = await Waiter.getDaysAndNames()
      return res.redirect('/days')
    }

    if(!checkAdmin){
      req.flash('errors', 'You do not have administrator access')
    return next()
    }

  }


  next()
}

app.get('/days', isAdmin, async function (req, res, next) {

 
   try {
     let shifts = await Waiter.getDaysAndNames()
     res.redirect('days', {
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

});


//start the server
let PORT = process.env.PORT || 5008;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});