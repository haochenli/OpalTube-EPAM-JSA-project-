import React from 'react';
import SignUpForm from '../SignUpForm';

const statusCodes = {
  'contentWrong': 400,
  'conflict': 409,
  'severError': 500,
  'success': 201,
};

class SignUpComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'status': 'being',
      'error': '',
      'errorUsername': false,
      'errorEmail': false,
      'errorPhone': false,
      'errorFullname': false,
      'errorPassword': false,
    };
  }
  submitHandler(ev) {
    this.state = {
      'status': 'being',
      'error': '',
      'errorUsername': false,
      'errorEmail': false,
      'errorPhone': false,
      'errorFullname': false,
      'errorPassword': false,
    };
    ev.preventDefault();
    let obj = {
      'username': ev.target.elements.namedItem('username').value,
      'email': ev.target.elements.namedItem('email').value,
      'phone number': ev.target.elements.namedItem('phone').value,
      'full name': ev.target.elements.namedItem('fullname').value,
      'password': ev.target.elements.namedItem('password').value,
    };
    let jsonData = JSON.stringify(obj);

    this.sendData(jsonData);
  }

  handleUserconflicterror(errorText) {
    if (errorText === 'username conflicts!') {
      this.setState({'errorUsername': true});
    }
    if (errorText === 'email conflicts!') {
      this.setState({'errorEmail': true});
    }
    if (errorText === 'phone number conflicts!') {
      this.setState({'errorPhone': true});
    }
  }

  handleUsererror(errorText) {
    if (errorText === 'the username is void') {
      this.setState({'errorUsername': true});
    }
  }
  handleEmailerror(errorText) {
    if (errorText === 'the email is void') {
      this.setState({'errorEmail': true});
    }
    if (errorText === 'the email format is invalid') {
      this.setState({'errorEmail': true});
    }
  }
  handlePhoneerror(errorText) {
    if (errorText === 'the phone number is void') {
      this.setState({'errorPhone': true});
    }
    if (errorText === 'the phone number is invalid') {
      this.setState({'errorPhone': true});
    }
  }
  handleFullnameerror(errorText) {
    if (errorText === 'the full name is void') {
      this.setState({'errorFullname': true});
    }
    if (errorText === 'the full name is invalid') {
      this.setState({'errorFullname': true});
    }
  }
  handlePassworderror(errorText) {
    if (errorText === 'the password is void') {
      this.setState({'errorPassword': true});
    }
    if (errorText === 'the password is too short') {
      this.setState({'errorPassword': true});
    }
  }
  judge409Error(xhr) {
    if (xhr.status === statusCodes.conflict) {
      const errorObj = JSON.parse(xhr.responseText);
      const errorText = errorObj.error;

      this.handleUserconflicterror(errorObj.error);

      this.setState({'error': errorText});
    }
  }
  judge400Error(xhr) {
    if (xhr.status === statusCodes.contentWrong) {
      const errorObj = JSON.parse(xhr.responseText);
      const errorText = errorObj.error;

      this.handleUsererror(errorText);
      this.handleEmailerror(errorText);
      this.handlePhoneerror(errorText);
      this.handleFullnameerror(errorText);
      this.handlePassworderror(errorText);
      this.setState({'error': errorText});
    }
  }
  judge500Error(xhr) {
    if (xhr.status === statusCodes.severError) {
      let errorText = JSON.parse(xhr.responseText).error;

      this.setState({'error': errorText});
    }
  }

  signupSuccess(response) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('expiresAt', response.expiresAt);

    window.location.href = '/home';
  }

  sendData(jsonData) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        this.setState({'status': 'being'});
        if (xhr.status === statusCodes.success) {
          const resultObj = JSON.parse(xhr.responseText);

          this.signupSuccess(resultObj);
        }
        this.judge409Error(xhr);
        this.judge400Error(xhr);
        this.judge500Error(xhr);
      }
    }.bind(this));
    this.xhrSet(xhr);
    this.setState({'status': 'loading'});
    xhr.send(jsonData);
  }

  xhrSet(xhr) {
    xhr.open('POST', '/api/signup');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
  }

  render() {
    const {
      status, error, errorUsername, errorEmail,
      errorPhone, errorFullname, errorPassword,
    } = this.state;

    return <SignUpForm
      isLoading={status === 'loading'}
      errorMessage={error}
      errorUsername={errorUsername}
      errorEmail={errorEmail}
      errorPhone={errorPhone}
      errorFullname={errorFullname}
      errorPassword={errorPassword}
      onSubmit={this.submitHandler.bind(this)}
    />;
  }
}

export default SignUpComponent;
