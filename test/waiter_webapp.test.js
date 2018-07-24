const WaiterApp = require('../waiter_webapp.js');
//const registration = Reg()
let assert = require("assert");

//postgres
var postgres = require('pg')
const Pool = postgres.Pool

let useSSL = false;
if(process.env.DATABASE_URL){
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:1234@localhost:5432/waiter_webapp_test'

const pool = new Pool({
  connectionString,
  ssl:useSSL
})

describe('Add Weekdays', function() {

  beforeEach(async function() {
    await pool.query("delete from shifts");

    await pool.query("delete from weekdays");
    await pool.query("delete from waiter");
  });

  it('Should return a list of weekdays', async function() {
    var waiterApp = WaiterApp(pool);

    assert.deepEqual(await waiterApp.addWeekdays(), [
  { day_name: 'Monday'},
  { day_name: 'Tuesday'},
  { day_name: 'Wednesday'},
  { day_name: 'Thursday'},
  { day_name: 'Friday'},
  { day_name: 'Saturday'},
  { day_name: 'Sunday'}])

  //console.log(await waiterApp.addWeekdays())
  });

  it('Should return a list of user names', async function(){
    var waiterApp = WaiterApp(pool);

  //  const waiter = await waiterApp.addWaiter({ username: 'greg', fullName: 'Greg Foulkes', })
    const waiter = await waiterApp.addWaiter({user_name:'greg', name: 'Greg Foulkes'})

    assert.deepEqual(waiter, true)

  //console.log(waiter)

});

it('Should return all the waiters names and usernames', async function(){
  var waiterApp = WaiterApp(pool);

  var userData = [{user_name: 'greg', name: 'Greg Foulkes'},
    {user_name: 'aya', name: 'Ayabonga Booi'},
    {user_name: 'luvuyo', name: 'Luvuyo Sono' },
    {user_name: 'aviwe', name: 'Aviwe Mbekeni'}
  ]

  assert.deepEqual(await waiterApp.addWaiters(userData), [{user_name: 'greg', name: 'Greg Foulkes'},
    {user_name: 'aya', name: 'Ayabonga Booi'},
    {user_name: 'luvuyo', name: 'Luvuyo Sono' },
    {user_name: 'aviwe', name: 'Aviwe Mbekeni'}
  ])

  //console.log(await waiterApp.addWaiters(userData))

});

it('Should return waiter and day ID', async function(){

  var waiterApp = WaiterApp(pool);

  var userData = [{user_name: 'greg', name: 'Greg Foulkes'},
    {user_name: 'aya', name: 'Ayabonga Booi'},
    {user_name: 'luvuyo', name: 'Luvuyo Sono' },
    {user_name: 'aviwe', name: 'Aviwe Mbekeni'}
  ]

  //var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  await waiterApp.addWaiters(userData);
  await waiterApp.addWeekdays();
  assert.equal(await waiterApp.assignShift('greg', 'Monday'), [{waiter_id: 1, weekday_id: 1}])

  console.log(await waiterApp.assignShift('greg', 'Monday'))
})

  after(async function() {
    await pool.end();
  });
});
