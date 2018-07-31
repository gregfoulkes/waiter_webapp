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

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:1234@localhost:5432/waiter_webapp_test'

const pool = new Pool({
  connectionString,
  ssl: useSSL
})

//start the server

let PORT = process.env.PORT || 5008;

app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});

//Handlebars setup

app.engine('handlebars', exphbs({
  defaultLayout: 'main',

}));

app.set('view engine', 'handlebars');

//call factory function

const WaiterApp = require('./waiter_webapp.js');
const Waiter = WaiterApp(pool);

app.get('/', async function(req, res, next){

  //  await Waiter.addWaiters()
await Waiter.addWeekdays()
await Waiter.addWaiters()
res.render('login')

})

app.post('/login', async function(req, res){

  res.redirect('/waiters/' + req.body.waiterName)
})

app.get('/waiters/:waiterName', async function(req, res, next) {

  await Waiter.deleteWeekdays()
  await Waiter.addWeekdays()

try{
    let shiftData = [{user_name: req.params.waiterName,
    day_name: req.body.dayName }]
    let days = await Waiter.getWeekdays()
    console.log(shiftData)
    res.render('waiter_webapp',{selectDays:days, shiftData} )

  } catch (err) {
    return next()
  }
});

app.post('/waiters/:username', async function(req, res, next) {

  await Waiter.deleteWeekdays()
  await Waiter.addWeekdays()

  console.log(username)

  try {
    let username = req.params.waiterName
    let days = await Waiter.getWeekdays()

    let shiftData = [{user_name: username,
    day_name: req.body.dayName }]

    await Waiter.assignShifts(shiftData)
    let getAllShifts = await Waiter.checkAllShifts()

    res.render('waiter_webapp',{selectDays:days, getAllShifts })

  } catch (err) {
    return next()
  }

});





app.get('/days', async function(res, req, next){

  try {
    let getAllShifts = await Waiter.checkAllShifts()

    res.render('shifts',{getAllShifts})
  } catch (err) {

    return next()
  }

});

// app.get('/waiters', async function (req, res){
//   //await Waiter.addWaiters(userData)
//   await Waiter.deleteWeekdays()
//
//   try {
//     res.render('waiter_webapp', await Waiter.weekdays()  )
//   } catch (err) {
//     return next()
//   }
// })

// app.get('/waiter:username', async function(req, res) {
//
// try {
//   res.render('waiter_webapp', )
// } catch (err) {
//   return next()
// }
//
// })


// (async function() {
//   await Waiter.addWaiters(userData);
//   await Waiter.addWeekdays();
//   console.log(await Waiter.assignShift('gregfoulkes', 'Monday'));
// }());

var userData = [{
    user_name: 'greg',
    full_name: 'Greg Foulkes'
  },
  {
    user_name: 'aya',
    full_name: 'Ayabonga Booi'
  },
  {
    user_name: 'luvuyo',
    full_name: 'Luvuyo Sono'
  },
  {
    user_name: 'aviwe',
    full_name: 'Aviwe Mbekeni'
  }
]
