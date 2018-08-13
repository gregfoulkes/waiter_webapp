module.exports = function (pool) {

  const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  let userData = [{
      user_name: 'greg',
      full_name: 'Greg Foulkes',
      position: 'admin'
    },
    {
      user_name: 'aya',
      full_name: 'Ayabonga Booi',
      position: 'waiter'

    },
    {
      user_name: 'luvuyo',
      full_name: 'Luvuyo Sono',
      position: 'waiter'

    },
    {
      user_name: 'aviwe',
      full_name: 'Aviwe Mbekeni',
      position: 'waiter'

    }
  ]

  async function addWeekdays() {
    for (var i = 0; i < WEEKDAYS.length; i++) {
      await pool.query('INSERT INTO weekdays (day_name) VALUES($1)', [WEEKDAYS[i]])
    }


  }

  async function getWeekdays(username) {
    let storedDays = await pool.query('select day_name from weekdays');
    let storedShifts = await checkShifts(username);
    for (let i = 0; i < storedDays.rowCount; i++) {
      let days = storedDays.rows[i];
      storedShifts.forEach(shift => {
        let matchedDay = shift.day_name;
        if (days.day_name === matchedDay) {
          days.checked = 'checked'
        }
      })

    }
   // console.log(storedDays.rows)
    return storedDays.rows
  }

  async function addWaiters() {

    for (let user of userData) {
      await pool.query('INSERT INTO waiter (user_name, full_name, position) VALUES($1, $2, $3)', [user.user_name, user.full_name, user.position]);
    }

    let enteredUserNames = await pool.query('SELECT user_name, full_name, position from waiter')
    return enteredUserNames.rows
  }

  async function addWaiter(params) {

    if (params.user_name != '' && params.full_name != '') {
      await pool.query('INSERT INTO waiter (user_name, full_name, position) VALUES($1, $2, $3)', [params.user_name, params.full_name, 'waiter'])
      return true
    } else {
      return false
    }

    let enteredUserNames = await pool.query('SELECT user_name, full_name from waiter')
    return enteredUserNames.rows
  }

  async function checkWaiter(checkName){

    let getAllUserNames = await pool.query('select count(*) as user_count from waiter where user_name = $1', [checkName]);

    let userResult = getAllUserNames.rows[0]
    if ( userResult.user_count && 
        Number(userResult.user_count) === 1) {
      return true;
    }
    return false;
  }

  async function assignShifts(params) {

    for (let shiftDays of params) {
      //  if (shiftData.userName != '' && shiftData.dayName != '') {
      let userResult = await pool.query('SELECT id from waiter WHERE user_name=$1', [shiftDays.user_name]);

      let dayResult = await pool.query('SELECT id from weekdays WHERE day_name=$1', [shiftDays.day_name]);

      await pool.query('INSERT INTO shifts(waiter_id, weekday_id) VALUES($1, $2)', [userResult.rows[0].id, dayResult.rows[0].id])
      //}
    }
    let result = await pool.query('select * from shifts')
    //console.log(result.rows)
    //return result.rows

  }

  const selectShift = async (shift) => {
    const weekdays = shift.day_names;
    const findUsernameID = await pool.query('SELECT id From waiter WHERE user_name=$1', [shift.user_name]);
    await pool.query('DELETE from shifts WHERE waiter_id = $1', [findUsernameID.rows[0].id]);
    
    if (findUsernameID.rowCount > 0) {
      let userID = findUsernameID.rows[0].id;
      for (let day of weekdays) {
        let findDayID = await pool.query('SELECT id From weekdays WHERE day_name=$1', [day]);
        await pool.query('INSERT INTO shifts (waiter_id, weekday_id) VALUES($1,$2)', [userID, findDayID.rows[0].id]);
      }

      return true;
    } else {
      return false;
    }

  }

  async function checkShifts(userName) {

    let poolQuery = await pool.query(`
        select distinct user_name, day_name from shifts
        join waiter on waiter.id = shifts.waiter_id
        join weekdays on weekdays.id = shifts.weekday_id
        where waiter.user_name = '${userName}';
        `);
    return poolQuery.rows
  }

  async function checkAllShifts() {
    let poolQuery = await pool.query(`
      select distinct user_name,full_name, day_name from shifts
      join waiter on waiter.id = shifts.waiter_id
      join weekdays on weekdays.id = shifts.weekday_id
    `)
    //console.log(poolQuery.rows)

    return poolQuery.rows
  }

  async function getDaysAndNames() {
    let assignedShifts = await checkAllShifts();
    // console.log(assignedShifts)

    const shiftList = [{
        id: 0,
        day: 'Sunday',
        Waiters: []
      },
      {
        id: 1,
        day: 'Monday',
        Waiters: []
      },
      {
        id: 2,
        day: 'Tuesday',
        Waiters: []
      },
      {
        id: 3,
        day: 'Wednesday',
        Waiters: []
      },
      {
        id: 4,
        day: 'Thursday',
        Waiters: []
      },
      {
        id: 5,
        day: 'Friday',
        Waiters: []
      },
      {
        id: 7,
        day: 'Saturday',
        Waiters: []
      }
    ]

    if (assignedShifts.length > 0) {
      for (let i = 0; i < assignedShifts.length; i++) {
        const shiftDay = assignedShifts[i].day_name;

        shiftList.forEach(current => {
         // console.log(current.Waiters)
          if (current.day === shiftDay) {
            current.Waiters.push(assignedShifts[i].full_name);

          }
          if (current.Waiters.length == 3) {
            current.color = "green";
          } else if (current.Waiters.length > 3) {
            current.color = "orange";
          }
        })
      }
    }
   // console.log('shiftList ' + shiftList)
    return shiftList;
  }

  async function deleteWeekdays() {

    let result = await pool.query('delete from weekdays')
    return result.rows
    }

 
   async function deleteUsers() {
    let result = await pool.query('delete from waiter')
    return result.rows
  }

  async function deleteShifts() {
    let result = await pool.query('delete from shifts')
    return result.rows
  }

  async function addClass() {
  }

  async function returnChecked(userName) {
    let storedWaiters = await pool.query('select user_name,full_name from waiter');
   // let storedShifts = await checkShifts(userName);
    for (let i = 0; i < storedWaiters.rowCount; i++) {
      let waiter = storedWaiters.rows[i];
     // console.log(days)
      //storedShifts.forEach(shift => {
       // let matchedDay = shift.day_name;
        //console.log(found)
        if (waiter.user_name === userName) {
          return waiter.full_name
          //days.checked = true
        }
      }

  }


  async function isAdmin(username){

    let checkUser = pool.query('select position from waiter where user_name =$1',[username])
    
    if(checkUser == 'admin'){
      return true
    }

    if(checkUser == 'waiter'){
      return false
    }

  }


  return {
  addWeekdays,
  addWaiter,
  addWaiters,
  assignShifts,
  checkShifts,
  checkAllShifts,
  deleteWeekdays,
  deleteUsers,
  deleteShifts,
  getWeekdays,
  getDaysAndNames,
  selectShift,
  returnChecked,
  checkWaiter,
  isAdmin
}



}