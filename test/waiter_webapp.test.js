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

    await waiterApp.addWeekdays()

    assert.deepEqual(await waiterApp.getWeekdays(), [
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
    const waiter = await waiterApp.addWaiter({user_name:'greg', full_name: 'Greg Foulkes'})

    assert.deepEqual(waiter, true)

  //console.log(waiter)

});

it('Should return all the waiters names and usernames', async function(){
  var waiterApp = WaiterApp(pool);

  var userData = [{user_name: 'greg', full_name: 'Greg Foulkes'},
    {user_name: 'aya', full_name: 'Ayabonga Booi'},
    {user_name: 'luvuyo', full_name: 'Luvuyo Sono' },
    {user_name: 'aviwe', full_name: 'Aviwe Mbekeni'}
  ]

  assert.deepEqual(await waiterApp.addWaiters(userData), [{user_name: 'greg', full_name: 'Greg Foulkes'},
    {user_name: 'aya', full_name: 'Ayabonga Booi'},
    {user_name: 'luvuyo', full_name: 'Luvuyo Sono' },
    {user_name: 'aviwe', full_name: 'Aviwe Mbekeni'}
  ])

  //console.log(await waiterApp.addWaiters(userData))

});

it('Should return waiter user_name and shift days', async function(){

  const waiterApp = WaiterApp(pool);

  const userData = [{user_name: 'greg', full_name: 'Greg Foulkes'}]

  await waiterApp.addWaiters(userData);
  await waiterApp.addWeekdays();

  await waiterApp.assignShift('greg', 'Monday');
  await waiterApp.assignShift('greg', 'Wednesday');

  assert.deepEqual(await waiterApp.checkShifts('greg'), [{ day_name:'Monday', user_name:'greg',},
  {day_name:'Wednesday', user_name:'greg' }
])

})

  after(async function() {
    await pool.end();
  });
});

// await waiterAvail.addShift("johndoe", "Thursday");
//
// let waiter_ids = await pool.query(
//  "SELECT id from users WHERE user_name = $1",
//  ["johndoe"]
// );
//
// let weekday_ids = await pool.query(
//  "SELECT id from weekdays WHERE day_name = $1",
//  ["Thursday"]
// );
//
// let waiter_id = waiter_ids.rows[0].id;
// let weekday_id = weekday_ids.rows[0].id;
//
// let shifts = await pool.query(
//  "select * from shifts WHERE waiter_id = $1 and weekday_id = $2",
//  [waiter_id, weekday_id]
// );
//
// let shift = shifts.rows[0];
//
// assert.equal(waiter_id, shift.waiter_id);
// assert.equal(weekday_id, shift.weekday_id);
