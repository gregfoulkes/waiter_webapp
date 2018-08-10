document.addEventListener('DOMContentLoaded', function () {
  var shift = document.querySelector('.shift');
  var register = document.querySelector('.register');
  var registered = document.querySelector('.registered');

  let display = document.querySelector('.shift');


  if (registered && registered.innerHTML !== '') {
    setTimeout(() => registered.innerHTML = '', 6000);
  }

  if (register && register.innerHTML !== '') {
    setTimeout(() => register.innerHTML = '', 6000);
  }

})