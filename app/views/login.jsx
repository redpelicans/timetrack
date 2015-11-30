import React, {Component} from 'react';
import classNames from 'classnames';
import {loginStore,  loginActions} from '../models/login';
import {Content} from './layout';

export default class LoginApp extends Component {

  componentDidMount(){
    gapi.load('auth2', () => { 
      let auth2 = gapi.auth2.getAuthInstance();
      if(!auth2){
        auth2 = gapi.auth2.init({
          client_id: "1013003508849-ke0dsjttftqcl0ee3jl7nv7av9iuij8p.apps.googleusercontent.com"
        });
      }

      const onFailure = (err) => {
        console.log("onFailure")
        console.log(err)
      } 

      const onSuccess = (user) => {
        console.log('Signed in as ' + user.getBasicProfile().getEmail());
        const nextRouteName = this.props.location.state && this.props.location.state.nextRouteName;
        loginActions.login(user, nextRouteName);
      } 

      auth2.attachClickHandler('signin-button', {}, onSuccess, onFailure);
    })
  }

  render(){
    const styles={
      container:{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10%',
      }
    };

    return(
      <Content>
        <div style={styles.container}>
          <a href="#" id='signin-button'>
            <img src="https://developers.google.com/accounts/images/sign-in-with-google.png"/>
          </a>
        </div>
      </Content>
    )
  }

}
