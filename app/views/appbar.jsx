import _ from 'lodash';
import React, {Component} from 'react';
import Avatar from '../components/avatar/app';
import routeData from '../routes';
import DropdownList from 'react-widgets/lib/DropdownList';
import { Link } from 'react-router'


export default class AppBar extends Component {

  render(){
    let styles={
      bar:{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        height: '100%',
        //fontSize: 'large',
        backgroundColor: '#37474f',
      },
      header:{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        order: 1,
        flex: '0 0 auto',
        backgroundColor: '#263238',
        height: '150px',
      },
      avatar:{
        order: 1,
      },
      user:{
        order: 2,
        color: 'white',
        marginBottom: '20px',
        marginLeft: '20px',
        marginRight: '20px',
      },
      menu:{
        order: 3,
      },
      spacerTop:{
        order: 2,
        height: '40px',
      },
      footer:{
        order: 5,
        flex: '10 1 auto',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
      },
      logout:{
        order: 1,
        alignSelf: 'flex-start',
        height: '60px',
        color: 'white',
      },
    }

    return (
      <div style={styles.bar}>
        <div style={styles.header}>
          <div style={styles.avatar}>
            <Avatar src="images/user.jpg"/>
          </div>
          <div style={styles.user}>
            <DropdownUserMenu user={ {email: 'eric.basley@redpelicans.com'} }/>
          </div>
        </div>
        <div style={styles.spacerTop}/>
        <div style={styles.menu}>
          <AppBarMenu toggleSideBar={this.props.toggleSideBar} currentTopic={this.props.currentTopic}/>
        </div>

        <div style={styles.footer}>
          <div style={styles.spacerTop}/>
        </div>

      </div>
    )
  }
}

class DropdownUserMenu extends Component {
  handleChange = (value) => {
    console.log(value)
  }

  render(){
    return (
      <DropdownList onChange={this.handleChange} value={this.props.user.email} data={[ "Logout", "Switch tenant"]}/>
    )
  }



}

class AppBarMenu extends Component {
  render(){
    let styles={
      menu:{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      },
    }

    let menu = routeData.filter(route => route.isMenu).map( e => {
      return (
        <AppBarItem key={e.topic} route={e} toggleSideBar={this.props.toggleSideBar} currentTopic={this.props.currentTopic}/>
      )
    });

    return (
      <div style={styles.menu}>
        {menu}
      </div>
    )
  }
}



class AppBarItem extends Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    currentTopic: React.PropTypes.string
  }

  handleClick = () => {
    this.context.history.pushState(null, "/"+this.props.route.path);
    this.props.toggleSideBar();
  }

  render(){
    let styles={
      item:{
        //height: '60px',
        paddingTop: '20px',
        paddingBottom: '20px',
        // manage active style with currentTopic
      },
      icon:{
        marginLeft: '20px',
        marginRight: '20px',
        color: '#757575'
      },
      active_icon:{
        marginLeft: '20px',
        marginRight: '20px',
        color: '#00BCD4',
        borderBottom: '6px solid #00BCD4'
      },
      label:{
        color: 'white',
        marginRight: '20px',
      },
    }

    if(this.props.route.topic === 'home'){
      console.log(this.context.currentTopic)
    }
    return (
      <div style={styles.item} className='navigation-link' onClick={this.handleClick}>
        <i className="material-icons" style={this.props.route.topic === this.context.currentTopic ? styles.active_icon : styles.icon}>{this.props.route.iconName}</i>
        <span style={styles.label}>{this.props.route.label}</span>
      </div>

    )
  }
}

