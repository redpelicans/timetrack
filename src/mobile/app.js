/* @flow */
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
} from 'react-native';

const Touch = TouchableHighlight

const webClientId = "1013003508849-ke0dsjttftqcl0ee3jl7nv7av9iuij8p.apps.googleusercontent.com"

// Routes
import {Router, Route} from './react-native-router'
import CompanyList from './components/company/list'
import PersonList from './components/person/list'
import MissionList from './components/mission/list'

import {Menu} from './components/menu'

import {LoginTimetrack} from './components/login'

import {Avatar, Icon, Image} from 'react-native-material-design'


const Header = (props) => {
  return (
    <View style={{padding: 10, height: 40, backgroundColor: "black"}}>
      <Text style={{fontSize: 18, alignSelf: "center", color: "white"}}>Timetrack by redpelicans</Text>
    </View>
  )
}

const Title = (props) => {
  return (
    <View style={{marginBottom: 22, marginTop: 22, alignItems: "center"}}>
      <Text style={{fontSize: 32, color: "black"}}>{props.children}</Text>
    </View>
  )
}

const Loading = () => <Text>Loading...</Text>

export class App extends Component {
  state = {};

  render() {
    const {logged, error} = this.state
    const loginButton = (
        <LoginTimetrack
          webClientId={webClientId}
          onTimetrackError={(err) => { console.warn("TIMETRACK ERROR: " + err) }}
          onSuccess={(user, logout) => {
            if (!user) {
              console.warn("Error: User is not authorized.")
              this.setState({error: true, logged: true, logout})
            }
            else {
              this.setState({logged: true, logout, user, error: false})
            }
          }}
          RenderLoading={Loading}
        />
    )
    const logoutButton = (
      <Touch
        underlayColor="rgb(93, 125, 196)"
        onPress={() => {
          if (this.state.logout)
            this.state.logout()
          this.setState({logged: false, logout: undefined, user: undefined})
        }}
      >
        <Text style={{fontSize: 20}}>Logout</Text>
      </Touch>
    )
    const errorMsg = (
      <View>
        <Text>ERROR</Text>
      </View>
    )

    const none = <View/>

    return (
      <View style={styles.container}>
        <Header />
        <Title>Authentification</Title>
        <View style={{alignItems: "center"}}>
          <Avatar size={100} text="GA" backgroundColor="paperBlue" />
          {!logged ? loginButton : logoutButton}
          {error ? errorMsg : none}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(232, 232, 232)',
  },
});
