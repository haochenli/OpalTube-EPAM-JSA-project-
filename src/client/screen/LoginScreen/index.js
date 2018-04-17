import React from 'react';
import LoginFrom from './Login-Form';

const statusCodes = {
  'success': 200,
  'contentWrong': 400,
  'notMatch': 403,
  'severError': 500,
};

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      usernamePass: true,
      passwordPass: true,
      errorMessage: '',
      loginStatus: 'notLogin',
    };
  }
  onSubmit(ev) {
    ev.preventDefault();
    let statusCode;
    let obj = {
      email: ev.target.elements.namedItem('email').value,
      password: ev.target.elements.namedItem('password').value,
    };

    this.setState({'loginStatus': 'logining'});
    fetch('/api/login', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(obj),
    }).then((response) => {
      statusCode = response.status;
      return response.json();
    }).then((result) => {
      if (statusCode === statusCodes.success) {
        // stroe token
        this.loginSuccess(result);
      } else {
        this.loginFailed(result);
      }
    });
  }
  loginSuccess(response) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('expiresAt', response.expiresAt);
    window.location.href = '/home';
  }
  loginFailed(response) {
    let errorMessage;

    errorMessage = response.error;
    this.setState({'errorMessage': errorMessage});
    this.setState({'loginStatus': 'notLogin'});
  }
  render() {
    return (
      <main>
        <LoginFrom
          onSubmit = {this.onSubmit}
          loginStatus = {this.state.loginStatus}
          errorMessage = {this.state.errorMessage}
        />
      </main>
    );
  }
}

export default LoginComponent;
