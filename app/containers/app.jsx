import React, {Component, PropTypes} from 'react';
import { routeActions } from 'react-router-redux'
import { connect } from 'react-redux';
import {logout} from '../actions/login';
import sitemap from '../routes';
import ReactToastr from 'react-toastr';
import {AvatarView} from '../components/widgets';
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

//import injecttapeventplugin from 'react-tap-event-plugin';
//injecttapeventplugin();
//
//

class App extends Component {
  handleGoHome = () => {
    this.props.dispatch(routeActions.push(sitemap.defaultRoute));
  }

  handleLogout = () => {
    this.props.dispatch(logout());
  }

  handleGotoRoute = (route) => {
    this.props.dispatch(routeActions.push(route));
  }

  handleViewPerson = () => {
    this.props.dispatch(
      routeActions.push({
        pathname: sitemap.person.view, 
        state: {personId: this.props.user.get('_id')},
      })
    );
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.errorMessage.message && nextProps.errorMessage.message!= this.props.errorMessage.message){
      const {message, header} = nextProps.errorMessage;
      this.refs.container.error(
        message, 
        header,
        { 
          closeButton: true,
          showDuration: 300, 
          hideDuration: 1000, 
          timeOut: 5000,
          extendedTimeOut: 1000,
          tapToDismiss: true,
        }
      );
    }
  }

  render(){
    const {user, currentTopic} = this.props;
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
          user={user}
          onGoHome={this.handleGoHome}
          onLogout={this.handleLogout}
          onViewPerson={this.handleViewPerson}
          gotoRoute={this.handleGotoRoute}
          currentTopic={currentTopic}/>
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

App.propTypes = {
  user:         PropTypes.object,
  errorMessage: PropTypes.object,
  currentTopic: PropTypes.string,
  dispatch:     PropTypes.func.isRequired,
}

const AppNav = ({user, onGoHome, onLogout, onViewPerson, currentTopic, gotoRoute}) =>{

  const collapseMenu = () => {
    $('#collapsingNavbar').collapse('toggle');
  }

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
  }

  const handleViewPerson = (e) => {
    e.preventDefault();
    onViewPerson();
  }

  const handleGoHome = (e) => {
    e.preventDefault();
    onGoHome();
  }

  const menu1 = () => {
    if(!user)return [];
    return sitemap.routes.filter(route => route.isMenu)
      .sort( (a,b) => a.isMenu > b.isMenu)
      .map( e => {
        return (
          <AppNavItem key={e.topic} gotoRoute={gotoRoute} route={e} currentTopic={currentTopic}/>
        )
    });
  }

  const menu2 = () => {
    if(!user)return [];
    return sitemap.routes.filter(route => route.isMenu)
      .sort( (a,b) => a.isMenu > b.isMenu)
      .map( e => {
        return (
          <AppMobileNavItem collapse={collapseMenu} key={e.topic} gotoRoute={gotoRoute} route={e} currentTopic={currentTopic}/>
        )
    });
  }

  const avatarBtn = () => {
    if(!user) return <div/> 
    return (
      <form className="form-inline navbar-form pull-right">
        <div>
          <button className="tm avatar-button" type="button" id="avatarmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            <AvatarView obj={user}/>
          </button>
          <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="avatarmenu">
            <h6 className="dropdown-header">{user.get('email')}</h6>
            <a className="dropdown-item" href="#" onClick={handleViewPerson} >View Profile</a>
            <a className="dropdown-item" href="#" onClick={handleLogout} >Logout</a>
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
          <span className="m-r-1">&#9776;</span>
          <span className="tm mobile header">Timetrack by redpelicans</span>
        </button>
        <div className="collapse navbar-toggleable-sm">
          <a className="navbar-brand tm brand" href="#" onClick={handleGoHome}>
            <i style={styles.logo} className="fa fa-paper-plane m-r-1"/>
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

AppNav.propTypes = {
  user:         PropTypes.object,
  currentTopic: PropTypes.string,
  onGoHome:     PropTypes.func.isRequired,
  onLogout:     PropTypes.func.isRequired,
  onViewPerson: PropTypes.func.isRequired,
  gotoRoute:    PropTypes.func.isRequired,
}

const AppNavItem = ({gotoRoute, route, currentTopic}) => {

  const handleClick = (e) => {
    e.preventDefault();
    gotoRoute(route);
  }


  const style = route.topic === currentTopic ? { borderBottomColor: '#1ca8dd !important', borderBottomStyle: 'solid'} : {};

  return (
    <li className="nav-item">
      <a style={style} className="nav-link" href="#" onClick={handleClick}>
        <span>{route.label}</span>
      </a>
    </li>
  )
}

AppNavItem.propTypes = {
  route:        PropTypes.object.isRequired,
  gotoRoute:    PropTypes.func.isRequired,
  currentTopic: PropTypes.string,
}

const AppMobileNavItem = ({gotoRoute, route, currentTopic, collapse}) =>  {
  const handleClick = (e) => {
    e.preventDefault();
    collapse();
    gotoRoute(route);
  }

  const styles={
    icon:{
      color: route.topic === currentTopic ? "#1ca8dd" : "",
    }
  }
  return (
    <li className="nav-item">
      <a className="nav-link" href="#" onClick={handleClick}>
        <i className={`fa fa-${route.iconName} m-a-1`} style={styles.icon}/>
        {route.label}
      </a>
    </li>
  )
}

AppMobileNavItem.propTypes = {
  route:        PropTypes.object.isRequired,
  currentTopic: PropTypes.string,
  collapse:     PropTypes.func.isRequired,
  gotoRoute:    PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    errorMessage: state.error,
    user: state.login.user,
    currentTopic: state.sitemap.currentRoute && state.sitemap.currentRoute.topic,
  }
}

export default connect(mapStateToProps)(App);
