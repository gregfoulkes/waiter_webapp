module.exports = function(pool) {

    const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    var userData = [{user_name: 'greg', full_name: 'Greg Foulkes'},
      {user_name: 'aya', full_name: 'Ayabonga Booi'},
      {user_name: 'luvuyo', full_name: 'Luvuyo Sono' },
      {user_name: 'aviwe', full_name: 'Aviwe Mbekeni'}
    ]

    async function addWeekdays() {
    for (var i = 0; i < WEEKDAYS.length; i++) {
      await pool.query('INSERT INTO weekdays (day_name) VALUES($1)', [WEEKDAYS[i]])
    }

    // let allDays = await pool.query('SELECT day_name from weekdays')
    // return allDays.rows
  }

  async function getWeekdays() {
    const weekdays = await pool.query("SELECT day_name FROM weekdays");
    return weekdays.rows;
  }


  async function addWaiters() {

    for (let user of userData) {
      await pool.query('INSERT INTO waiter (user_name, full_name) VALUES($1, $2)', [user.user_name, user.full_name]);
    }

    let enteredUserNames = await pool.query('SELECT user_name, full_name from waiter')
    return enteredUserNames.rows
  }

  async function addWaiter(params) {

    if (params.user_name != '' && params.name != '') {
      await pool.query('INSERT INTO waiter (user_name, full_name) VALUES($1, $2)', [params.user_name, params.full_name])
      return true
    } else {
      return false
    }

    let enteredUserNames = await pool.query('SELECT user_name, full_name from waiter')
    return enteredUserNames.rows
  }

  async function assignShift(userName, dayName) {

    // for (let shiftData of params){}(
    //
    // )

    if (userName != '' && dayName != '') {
      let userResult = await pool.query('SELECT id from waiter WHERE user_name=$1', [userName]);

      let dayResult = await pool.query('SELECT id from weekdays WHERE day_name=$1', [dayName]);

      await pool.query('INSERT INTO shifts(waiter_id, weekday_id) VALUES($1, $2)', [userResult.rows[0].id, dayResult.rows[0].id])
      //}
    }


  }

  async function checkShifts(userName, dayName) {

    let poolQuery = await pool.query(`
        select distinct user_name, day_name from shifts
        join waiter on waiter.id = shifts.waiter_id
        join weekdays on weekdays.id = shifts.weekday_id
        where weekdays.day_name = '${dayName}'
        and waiter.user_name = '${userName}';
      `);

    console.log(poolQuery.rows)
    return poolQuery.rows
  }

  async function checkShifts(userName) {

    let poolQuery = await pool.query(`
        select distinct user_name, day_name from shifts
        join waiter on waiter.id = shifts.waiter_id
        join weekdays on weekdays.id = shifts.weekday_id

        where waiter.user_name = '${userName}';

      `);
    console.log(poolQuery.rows)
    return poolQuery.rows
  }

  async function checkAllShifts() {

    let poolQuery = await pool.query(`
    `)

  }

  async function deleteWeekdays() {

    let result = await pool.query('delete from weekdays')
    return result.rows
  }

  async function deleteUsers(){
    let result = await pool.query('delete from waiter')
    return result.rows
  }

  async function deleteShifts(){
    let result = await pool.query('delete from shifts')
    return result.rows
  }

  return {
    addWeekdays,
    addWaiter,
    addWaiters,
    assignShift,
    checkShifts,
    deleteWeekdays,
    deleteUsers,
    deleteShifts,
    getWeekdays
  }

  }
