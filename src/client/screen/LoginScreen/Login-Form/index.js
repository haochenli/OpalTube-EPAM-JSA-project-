import React from 'react';
import './index.scss';
import {Link} from 'react-router-dom';

const LoginForm = (props) => (
  <form onSubmit={props.onSubmit} className="login-form">
    <h1>Login</h1>
    <input type="email" name="email" required placeholder="E-mail"/>
    <input type="password" name="password"
      minLength="6" required placeholder="Password"/>
    <input type="submit"
      value={props.loginStatus === 'notLogin' ? 'Login' : 'Logining'}
      disabled={props.loginStatus === 'notLogin' ? false : true}
      className={props.loginStatus === 'notLogin' ? '' : 'logining'}
    />
    <Link to="/signup" className="register-link">register now</Link>
    <span className="error-message">{props.errorMessage}</span>
  </form>
);

export default LoginForm;

