import {logIn} from './login.js';

const loginForm = document.querySelector('.login');

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    logIn(email, password);
  });

}
