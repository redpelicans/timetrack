import React, {Component} from 'react';
import Router from 'react-router';
import routeData from './routes';
import Nav from './models/nav.js';
import errors from './models/errors.js';
import Avatar from './views/avatar';
import ReactToastr from 'react-toastr';
let {ToastContainer} = ReactToastr;
let ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);


//import injecttapeventplugin from 'react-tap-event-plugin';
//injecttapeventplugin();


export default class App extends Component {

  static childContextTypes = {
    history: React.PropTypes.object,
    currentTopic: React.PropTypes.string,
  }

  componentDidMount(){
    //console.log("==========> app mounted ...")
  }

  getChildContext(){
    return {
      history: this.props.history,
      currentTopic: this.state.currentTopic,
    };
  }

  state = {sidebarOpen: false}

  componentDidMount(){
    Nav.property.onValue(topic => {
      this.setState({currentTopic: topic.currentTopic});
    });
    errors.state.onValue(err => {
      this.refs.container.error(
        err.message, 
        err.header,
        { 
          closeButton: true,
          showDuration: 300, 
          hideDuration: 1000, 
          timeOut: 5000,
          extendedTimeOut: 1000,
          tapToDismiss: true,
        }
      );
    })
  }

  render(){
    let styles={
      toast:{
        position: 'fixed',
        zIndex: 999999,
        pointerEvents: 'None',
        top: '100px',
        right: '12px'
      },
      content:{
        width: '70%',
      }
    }
    return (
      <div className="ts">
        <AppNav currentTopic={this.state.currentTopic}/>
        <div className="ft ui" style={styles.content}>
          {this.props.children}
        </div>
        <ToastContainer style={styles.toast} ref="container" toastMessageFactory={ToastMessageFactory} />
      </div>
    )
  }
}

App.contextTypes = {router: React.PropTypes.func};

class AppNav extends Component{

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    currentTopic: React.PropTypes.string
  }

  collapseMenu = () => {
    $('#collapsingNavbar').collapse('toggle');
  }

  render(){
    let menu1 = routeData.filter(route => route.isMenu).map( e => {
      return (
        <AppNavItem key={e.topic} route={e} currentTopic={this.props.currentTopic}/>
      )
    });

    let menu2 = routeData.filter(route => route.isMenu).map( e => {
      return (
        <AppMobileNavItem collapse={this.collapseMenu} key={e.topic} route={e} currentTopic={this.props.currentTopic}/>
      )
    });



    let home = this.context.history.createHref('/home');
    let styles={
      header:{
        fontFamily: "Helvetica",
      },
      mobile:{
        header:{
          fontSize: '2rem',
          fontFamily: "Helvetica",
          outline: "none !important",
        },
        button:{
          outline: "none !important",
        },
      },
      button:{
        padding: "0",
        border: "0",
        background: "transparent",
        outline: "none !important",
        boxShadow: "none !important",
      },
      avatar:{
        height: "35px",
        width: "35px",
        borderRadius: "50%",
        border: "0",
        verticalAlign: "middle",

      },
      popover:{
        top: "42px",
        left: "-169px",
        display: 'block',
      },
      arrow:{
        left: "91.4216%",
      },
      item:{
        width: "20px",
      }
    }

    return (
      <div>
        <div className="collapse hidden-sm-up" id="collapsingNavbar">
          <div className="bg-inverse p-a">
            <ul className="nav nav-pills nav-stacked">
              {menu2}
            </ul>
          </div>
        </div>
        <nav className="ci ou g navbar navbar-fixed-top">
          <button style={styles.mobile.button} className="m-a navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
            <span className="m-r">&#9776;</span>
            <span style={styles.mobile.header}>Timetrack by redpelicans</span>
          </button>
          <div className="ft ui collapse navbar-toggleable-xs" style={styles.header}>
            <a className="navbar-brand ol tu" href={home}>
              <i className="fa fa-paper-plane m-r"/>
              Timetrack by redpelicans
            </a>
            <ul className="nav navbar-nav">
              {menu1}
            </ul>
            <form className="form-inline navbar-form pull-right">
              <div className="dropdown fa oo ny">
                <button style={styles.button} type="button" id="avatarmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <img style={styles.avatar} src="images/user.jpg"/>
                </button>
                <ul className="dropdown-menu" aria-labelledby="avatarmenu">
                  <li><a href="#" data-action="logout">Logout</a></li>
                </ul>
              </div>
            </form>
          </div>
        </nav>
      </div>
    )
  }
}


class AppNavItem extends Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    currentTopic: React.PropTypes.string
  }

  render(){
    let route = this.props.route;
    let currentTopic = this.props.currentTopic;
    let href = this.context.history.createHref(route.path);


    let styles={
      menu:{
        get borderBottomStyle(){
          if(route.label === 'companies'){
            console.log(currentTopic + "===" + route.topic)
            console.log(route.topic === currentTopic)
          }
          return (route.topic === currentTopic ? "solid !important" : "inherit");
        },
        get borderBottomColor(){
          return route.topic === currentTopic ? "#1ca8dd !important" : "inherit";
        },
      }
    }

    return (
      <li className="nav-item">
        <a style={styles.menu} href={href}>
          <span>{route.label}</span>
        </a>
      </li>
    )
  }
}

class AppMobileNavItem extends Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    currentTopic: React.PropTypes.string
  }

  render(){
    let route = this.props.route;
    let currentTopic = this.props.currentTopic;
    let href = this.context.history.createHref(route.path);
    let styles={
      icon:{
        get color(){
          return route.topic === currentTopic ? "#1ca8dd" : "";
        }
      }
    }
    return (
      <li className="nav-item">
        <a className="" href={href} onClick={this.props.collapse}>
          <i className={`fa fa-${route.iconName} m-a`} style={styles.icon}/>
          {route.label}
        </a>
      </li>
    )
  }
}




