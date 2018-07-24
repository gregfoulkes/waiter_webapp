module.exports = function(pool) {

    const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    var userData = [{user_name: 'greg', name: 'Greg Foulkes'},
      {user_name: 'aya', name: 'Ayabonga Booi'},
      {user_name: 'luvuyo', name: 'Luvuyo Sono' },
      {user_name: 'aviwe', name: 'Aviwe Mbekeni'}
    ]

    async function addWeekdays() {
        for (var i = 0; i < WEEKDAYS.length; i++) {
         await pool.query('INSERT INTO weekdays (day_name) VALUES($1)', [WEEKDAYS[i]])
        }

        let allDays = await pool.query('SELECT day_name from weekdays')
        return allDays.rows
      }


  async function addWaiters(userData) {

    for (let user of userData) {
      await pool.query('INSERT INTO waiter (user_name, name) VALUES($1, $2)', [user.user_name, user.name]);
    }

    let enteredUserNames = await pool.query('SELECT user_name, name from waiter')
    return enteredUserNames.rows
  }

  async function addWaiter(params) {

    if(params.user_name != '' && params.name != '' ){
      await pool.query('INSERT INTO waiter (user_name, name) VALUES($1, $2)', [params.user_name, params.name])
      return true
    }else{
      return false
    }

    let enteredUserNames = await pool.query('SELECT user_name, name from waiter')
    return enteredUserNames.rows
  }

  async function assignShift(username, day){

    if(username != '' && day != ''){
      let userResult = await pool.query('SELECT id from waiter WHERE user_name=$1',[username]);
      console.log('userResult: ' + userResult.rows[0]);
      //if (userResult.rowcount > 0){
        let dayResult = await pool.query('SELECT id from weekdays WHERE day_name=$1',[day]);
        console.log('dayResult: ' + dayResult.rows[0]);
        await pool.query ('INSERT INTO shifts(waiter_id, weekday_id) VALUES($1, $2)',[userResult.rows[0].id, dayResult.rows[0].id])
      //}
    }
    let seeShifts = ('SELECT waiter_id, weekday_id from shifts ')
return seeShifts.rows
  }

      return{
        addWeekdays,
        addWaiter,
        addWaiters,
        assignShift
      }

    }
