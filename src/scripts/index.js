import Darkmode from 'darkmode-js';

const dmoptions = {
    bottom: '64px', // default: '32px'
    right: 'unset', // default: '32px'
    left: '32px', // default: 'unset'
    time: '0.5s', // default: '0.3s'
    mixColor: '#fff', // default: '#fff'
    backgroundColor: '#fff',  // default: '#fff'
    buttonColorDark: '#100f2c',  // default: '#100f2c'
    buttonColorLight: '#fff', // default: '#fff'
    saveInCookies: false, // default: true,
    label: '🌓', // default: ''
    autoMatchOsTheme: false // default: true
  }

const dm = new Darkmode(dmoptions);


document.getElementById("darkbutton").onclick = function() {

    dm.toggle();
  console.log("hello")
}

console.log(document.getElementById("darkbutton"))