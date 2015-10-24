import React, {Component} from 'react';
import classNames from 'classnames';
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
        zIndex: 9999,
        pointerEvents: 'None',
        top: '100px',
        right: '12px'
      },
    }
    return (
      <div>
        <AppNav currentTopic={this.state.currentTopic}/>
        <div className="m-t-70 container-fluid">
          <div className="row m-t">
            {this.props.children}
          </div>
          <ToastContainer style={styles.toast} ref="container" toastMessageFactory={ToastMessageFactory} />
        </div>
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
      dropdownMenuItem:{
        color: '#cfd2da',
        paddingLeft: '20px',
      }
    }

    return (
      <div >
        <div className="m-t-70 collapse hidden-md-up bg-inverse p-a" id="collapsingNavbar">
            <ul className="nav nav-pills nav-stacked">
              {menu2}
            </ul>
        </div>
        <nav className="navbar navbar-fixed-top navbar-dark bg-inverse tm header black">
          <button className="p-a navbar-toggler hidden-md-up tm mobile button" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
            <span className="m-r">&#9776;</span>
            <span className="tm mobile header">Timetrack by redpelicans</span>
          </button>
          <div className="collapse navbar-toggleable-sm">
            <a className="navbar-brand tm brand" href={home}>
              <i className="fa fa-paper-plane m-r"/>
              Timetrack by redpelicans
            </a>
            <ul className="nav navbar-nav tm menu item">
              {menu1}
            </ul>
            <form className="form-inline navbar-form pull-right">
              <div>
                <button className="tm avatar-button" type="button" id="avatarmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <img className="tm avatar" src="images/user.jpg"/>
                </button>
                <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="avatarmenu">
                  <h6 className="dropdown-header">User's actions</h6>
                  <a className="dropdown-item" href="#">Logout</a>
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

    let style = route.topic === currentTopic ? { borderBottomColor: '#1ca8dd !important', borderBottomStyle: 'solid'} : {};

    return (
      <li className="nav-item">
        <a style={style} className="nav-link" href={href}>
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
        color: route.topic === currentTopic ? "#1ca8dd" : "",
      }
    }
    return (
      <li className="nav-item">
        <a className="nav-link" href={href} onClick={this.props.collapse}>
          <i className={`fa fa-${route.iconName} m-a`} style={styles.icon}/>
          {route.label}
        </a>
      </li>
    )
  }
}




