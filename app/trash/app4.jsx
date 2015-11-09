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

  render(){
    let menu = routeData.filter(route => route.isMenu).map( e => {
      return (
        <AppNavItem key={e.topic} route={e} currentTopic={this.props.currentTopic}/>
      )
    });

    let home = this.context.history.createHref('/home');
    let styles={
      header:{
        fontFamily: "Helvetica",
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
      <nav className="ci ou g">
        <div className="ft ui">
          <div className="oj" style={styles.header}>
            <button className="om collapsed" type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="ct">Toggle navigation</span>
              <span className="on"></span>
              <span className="on"></span>
              <span className="on"></span>
            </button>
            <a className="ol tu" href={home}>
              <span className="glyphicon glyphicon-send tt"/>
              Timetrack by redpelicans
            </a>
          </div>
          <div id="navbar" className="ok collapse">
            <ul className="nav navbar-nav">
              {menu}
            </ul>
            <ul className="nav navbar-nav hidden">
              <li><a href="#" data-action="logout">Logout</a></li>
            </ul>
            <form className="fa oo ny">
              <div className="aol">
              {/*<input className="form-control" type="text" placeholder="Search..."/>*/}
                {/*<span className="glyphicon glyphicon-send bv"/>*/}
              </div>
            </form>
            <div className="dropdown fa oo ny">
              <button style={styles.button} type="button" id="avatarmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <img style={styles.avatar} src="images/user.jpg"/>
              </button>
              <ul className="dropdown-menu" aria-labelledby="avatarmenu">
                <li><a href="#" data-action="logout">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
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
    let href = this.context.history.createHref(route.path);
    return (
      <li className={route.topic === this.context.currentTopic ? "active" : "inactive"}>
        <a href={href}>{route.label}</a>
      </li>
    )
  }
}


