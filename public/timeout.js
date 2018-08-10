var shift = document.querySelector('.shift');
var register = document.querySelector('.register');
var registered = document.querySelector('.registered');

let display = document.querySelector('.shift');

if(display !==''){
  setTimeout(() => 
  display.innerHTML ='',6000
)
}

if(registered !==''){
  setTimeout(() => 
  registered.innerHTML ='',6000
)
}