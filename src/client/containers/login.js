import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {Content} from '../components/layout';
import { connect } from 'react-redux';
import { loginRequest } from '../actions/login';
import { replaceRoute } from '../actions/routes';
import routes from '../routes';

export default class LoginApp extends Component {

  componentWillMount(){
    if(this.props.user){
      this.props.dispatch(replaceRoute(routes.defaultRoute));
    }
  }

  componentDidMount(){
    gapi.load('auth2', () => { 
      let auth2 = gapi.auth2.getAuthInstance();
      if(!auth2){
        auth2 = gapi.auth2.init({
          client_id: "1013003508849-ke0dsjttftqcl0ee3jl7nv7av9iuij8p.apps.googleusercontent.com"
        });
      }

      const onFailure = (err) => {
        //console.log(err)
      } 

      const onSuccess = (user) => {
        const {dispatch, login} = this.props;
        console.log('Signed in as ' + user.getBasicProfile().getEmail());
        const nextRouteName = this.props.location.state && this.props.location.state.nextRouteName;
        dispatch(loginRequest(user, nextRouteName));
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
            <img src="/images/sign-in-with-google.png"/>
          </a>
        </div>
      </Content>
    )
  }
}

LoginApp.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user:     PropTypes.object,
}

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}
export default connect(mapStateToProps)(LoginApp);

