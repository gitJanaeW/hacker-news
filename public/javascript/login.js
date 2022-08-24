// async establishes that the functio is async
async function signupFormHandler(event) {
    event.preventDefault();
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  
    if (username && email && password) {
      // await establishes what the function is waiting on (in this case the post response from the server)
      const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({username, email, password}),
        headers: { 'Content-Type': 'application/json' }
      });
      // if no err, return response
      if (response.ok) {
        console.log(response);
      } // else, "catch()" errer and return alert message 
      else {
        alert(response.statusText);
      }
    }
}

async function loginFormHandler(event) {
  event.preventDefault();
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();
  if (email && password) {
    const response = await  fetch('api/users/login', {
      method: 'post', 
      body: JSON.stringify({email, password}),
      headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
      // move to the '/' route
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);