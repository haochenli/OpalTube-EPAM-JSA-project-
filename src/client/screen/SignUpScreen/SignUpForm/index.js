import React from 'react';
import './index.scss';
import {Link} from 'react-router-dom';

const SignUpForm = (props) => (
  <form className="signup-form" onSubmit={props.onSubmit}>
    <h1>Create new user</h1>
    <input name="username"
      className={props.errorUsername ? 'error' : ''}
      placeholder="Username " />
    <input type="email" name="email" placeholder="E-mail" required
      className={props.errorEmail ? 'error' : ''}/>
    <input name="phone" placeholder="Phone Number"
      className={props.errorPhone ? 'error' : ''}/>
    <input name="fullname" placeholder="Full Name" required
      className={props.errorFullname ? 'error' : ''}/>
    <input type="password" name="password" placeholder="Password" required
      pattern=".{6,}"
      className={props.errorPassword ? 'error' : ''}/>
    <input type="submit"
      value={props.isLoading ? 'loading' : 'Signup'}
      className={props.isLoading ? 'loading' : ''}
      disabled={props.isLoading ? true : false }/>
    <Link to="/login" className="login-link">login now</Link>
    <span >{props.errorMessage}</span>
  </form>
);

export default SignUpForm;
