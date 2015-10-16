import _ from 'lodash';
import React, {Component} from 'react';
import Router from 'react-router';
import routeData from './routes';
import Avatar from './components/avatar/app';
//import injecttapeventplugin from 'react-tap-event-plugin';
//injecttapeventplugin();



export default class App extends Component {

  render(){
    return (
      <div className="timetrack">
        <SideBar/>
        <Header/>
        <Pusher/>
      </div>
    )

  }
}

class Header extends Component {
  render(){
    let styles = {
      header:{
        paddingTop: '40px',
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
      },
    }

   return (
      <div className='ui grid'>
        <div className="ui raised segment header two column row" style={styles.header}>
          <div className="eleven wide column">
            <h1 className="ui header">
              <div className="openslidebar">
                <i className="sidebar icon"></i>
                TimeTrack
              </div>
             </h1>
          </div>
          <div className="five wide right aligned column">
            <div className="">
              <i className="material-icons">search</i>
              <i className="material-icons">more_vert</i>
            </div>
          </div>
        </div>
      </div>
    )
     
  }
}


class Pusher extends Component {
  render(){
    let styles = {
      pusher:{
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '40px',
        paddingRight: '40px',
      }
      
    }

    return (
      <div className="pusher sixteen wide column" style={styles.pusher}>
        <span> content</span>
      </div>
    )
  }
}


class SideBar extends Component {
  handleNavigationClick = () => {
    $('#sidebar').sidebar('hide');
 
  }

  componentDidMount(){

    $('#userMenu').dropdown({
      onChange: (text, value) => {
        console.log("Logout")
      }
    });

    $('#sidebar')
    .sidebar({ 
      //context: $('.example .bottom.segment')
    })
    .sidebar('attach events', '.timetrack .openslidebar');
  }

  render(){
    let styles={
      bar:{
        backgroundColor: '#37474f',
        width: '280px',
        fontWeight: 'Roboto',
      },
      avatar:{
      },
      header:{
        backgroundColor: '#263238',
        paddingTop: '20px',
        paddingBottom: '20px',
      },
      menu:{
        color: 'white',
        paddingTop: '20px',
      },
      item:{
      },
      icon:{
        color: '#78909c',
        fontSize: '1.5em'
      },
    }
    return (
      <div id='sidebar' className="ui sidebar" style={styles.bar}>
        <div className="ui padded grid" style={styles.header} >
          <div className="row">
            <div className="center aligned column" style={styles.avatar}>
            <Avatar src="images/user.jpg"/>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <div className="ui floating dropdown button" id='userMenu'>
                 eric.basley@redpelicans.com
                 <i className="dropdown icon"></i>
                 <div className="menu">
                   <a className="item" href="#Logout"><i className="sign out icon"></i>Logout</a>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ui padded two column centered grid" style={styles.menu} >
          <div className="row navigation-link" style={styles.item}>
            <div className="right aligned four wide column" style={styles.icon}>
              <i className="plug icon"></i>
            </div>
            <div className="left aligned twelve wide column" onClick={this.handleNavigationClick}>
              <div className="text">Companies</div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
