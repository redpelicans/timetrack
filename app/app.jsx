import _ from 'lodash';
import React, {Component} from 'react';
import classNames from 'classnames';
import sitemap from './sitemap';
import {navStore} from './models/nav';
import {loginStore, loginActions} from './models/login';
import errors from './models/errors';
import ReactToastr from 'react-toastr';
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);


//import injecttapeventplugin from 'react-tap-event-plugin';
//injecttapeventplugin();


export default class App extends Component {

  static childContextTypes = {
    history: React.PropTypes.object,
    currentTopic: React.PropTypes.string,
  }

  getChildContext(){
    return {
      history: this.props.history,
      currentTopic: this.state.currentTopic,
    };
  }

  state = {};

  componentWillUnmount(){
    if(this.unsubscribeNav) this.unsubscribeNav();
    if(this.unsubscribeLogin) this.unsubscribeLogin();
  }

  componentDidMount(){

    this.unsubscribeNav = navStore.listen( state => {
      this.setState({currentTopic: state.topic});
    });

    this.unsubscribeLogin = loginStore.listen( state => {
      this.setState({user: state.user});
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

  handleGoHome = () => {
    navActions.push(sitemap.defaultRoute);
  }

  handleLogout = () => {
    loginActions.logout();
  }

  render(){
    const styles={
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
        <AppNav 
          user={this.state.user}
          onGoHome={this.handleGoHome}
          onLogout={this.handleLogout}
          currentTopic={this.state.currentTopic}/>
        <div className="m-t-70 container-fluid">
          <div className="row m-t">
            {this.props.children}
          </div>
          <ToastContainer 
            style={styles.toast} 
            ref="container" 
            toastMessageFactory={ToastMessageFactory} />
        </div>
      </div>
    )
  }
}

class AppNav extends Component{

  collapseMenu = () => {
    $('#collapsingNavbar').collapse('toggle');
  }

  handleLogout = (e) => {
    e.preventDefault();
    this.props.onLogout();
  }

  handleGoHome = (e) => {
    e.preventDefault();
    this.props.onGoHome();
  }

  render(){
    const menu1 = () => {
      if(!loginStore.isLoggedIn())return [];
      return sitemap.routes.filter(route => route.isMenu).map( e => {
        return (
          <AppNavItem key={e.topic} route={e} currentTopic={this.props.currentTopic}/>
        )
      });
    }

    const menu2 = () => {
      if(!loginStore.isLoggedIn())return [];
      return sitemap.routes.filter(route => route.isMenu).map( e => {
        return (
          <AppMobileNavItem collapse={this.collapseMenu} key={e.topic} route={e} currentTopic={this.props.currentTopic}/>
        )
      });
    }

    const avatarBtn = () => {
      if(!loginStore.isLoggedIn()) return <div/> 
      return (
        <form className="form-inline navbar-form pull-right">
          <div>
            <button className="tm avatar-button" type="button" id="avatarmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <img className="tm avatar" src="images/user.jpg"/>
            </button>
            <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="avatarmenu">
              <h6 className="dropdown-header">{this.props.user.name}</h6>
              <a className="dropdown-item" href="#" onClick={this.handleLogout} >Logout</a>
            </ul>
          </div>
        </form>
      )
    }

    const styles={
      dropdownMenuItem:{
        color: '#cfd2da',
        paddingLeft: '20px',
      },
      logo:{
        color: "#cd4436",
      }
    }

    return (
      <div >
        <div className="m-t-70 collapse hidden-md-up bg-inverse p-a" id="collapsingNavbar">
            <ul className="nav nav-pills nav-stacked">
              {menu2()}
            </ul>
        </div>
        <nav className="navbar navbar-fixed-top navbar-dark bg-inverse tm header black">
          <button className="p-a navbar-toggler hidden-md-up tm mobile button" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
            <span className="m-r">&#9776;</span>
            <span className="tm mobile header">Timetrack by redpelicans</span>
          </button>
          <div className="collapse navbar-toggleable-sm">
            <a className="navbar-brand tm brand" href="#" onClick={this.handleGoHome}>
              <i style={styles.logo} className="fa fa-paper-plane m-r"/>
              Timetrack by redpelicans
            </a>
            <ul className="nav navbar-nav tm menu item">
              {menu1()}
            </ul>
            {avatarBtn()}
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
    const route = this.props.route;
    const currentTopic = this.props.currentTopic;
    const href = this.context.history.createHref(route.path);

    const style = route.topic === currentTopic ? { borderBottomColor: '#1ca8dd !important', borderBottomStyle: 'solid'} : {};

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
    const route = this.props.route;
    const currentTopic = this.props.currentTopic;
    const href = this.context.history.createHref(route.path);
    const styles={
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




