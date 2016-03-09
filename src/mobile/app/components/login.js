import React, {cloneElement, Component, PropTypes, Text, View, TouchableHighlight} from 'react-native'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin'

const Touch = TouchableHighlight


export class LoginTimetrack extends Component {
  static propTypes = {
    webClientId: PropTypes.string.isRequired,
    onGoogleError: PropTypes.func,
    onTimetrackError: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    RenderLoading: PropTypes.func, //stateless component
  };

  state = {};

  componentDidMount(){
    GoogleSignin.configure({
      webClientId: this.props.webClientId,
    })
    GoogleSignin.currentUserAsync().then(user => {
      this.setState({user: user})
    }).done()
  }

  _login() {
    const {onGoogleError} = this.props
    GoogleSignin.signIn()
    .then(user => {
      this.setState({user: user})
    })
    .catch(err => { if (onGoogleError) onGoogleError(err) })
    .done()
  }

  _logout() {
    GoogleSignin.revokeAccess()
    .then(() => GoogleSignin.signOut())
    .done()
  }


  _queryTimetrackServer(token) {
    const {onTimetrackError, onSuccess} = this.props
    const options = {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id_token: token})
    }

    fetch('http://rp3.redpelicans.com:7011/login', options)
    .then(res => res.text())
    .then(res => {
      const user = JSON.parse(res).user
      onSuccess(user, () => this._logout())
    })
    .catch(err => { onTimetrackError(err) })
  }

  render(){
    const {onTimetrackError, onSuccess, RenderLoading} = this.props
    if (this.state.user === null) {
      return (
        <GoogleSigninButton
          style={{width: 312, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => this._login()}
        />
      )
    }
    else if (this.state.user)
      this._queryTimetrackServer(this.state.user.idToken)
    return <RenderLoading />
  }
}
