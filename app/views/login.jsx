import React, {Component} from 'react';
import classNames from 'classnames';
import loginForm from '../forms/login';
import {loginStore,  loginActions} from '../models/login';
import {Form, InputField} from './widgets';

export default class LoginApp extends Component {

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit();
    if(this.unsubscribeState) this.unsubscribeState();
  }

  componentWillMount(){
    const nextPath = this.props.location.state ? this.props.location.state.nextPath : '/';
    this.loginForm = loginForm();

    this.unsubscribeState = this.loginForm.onValue( state => {
      this.setState({
        canLogin: state.canSubmit,
      });
    });

    this.unsubscribeSubmit = this.loginForm.onSubmit( state => {
      loginActions.login(this.loginForm.toDocument(state), nextPath);
    });
  }

  handleLogin = () => {
    this.loginForm.submit();
  }

  render(){
    return(
      <div>
        <Form>
          <div className="row">
            <div className="col-md-12">
              <InputField field={this.loginForm.field('userName')}/>
            </div>
            <div className="col-md-12">
              <InputField field={this.loginForm.field('password')}/>
            </div>
            <LoginBtn onLogin={this.handleLogin} canLogin={this.state.canLogin}/>
          </div>
        </Form>
      </div>
    )
  }
}

export const LoginBtn = ({onLogin, canLogin}) => {
  const handleChange = (e) => {
    onLogin();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-primary m-l" disabled={!canLogin} onClick={handleChange}>Login</button>
  )
}


