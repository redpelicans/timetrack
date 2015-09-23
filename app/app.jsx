import _ from 'lodash';
import React, {Component} from 'react';
import Router from 'react-router';
import routes, {appRoutesData} from './routes';
import Avatar from './components/avatar/app';
import injecttapeventplugin from 'react-tap-event-plugin';
injecttapeventplugin();

//import mui from 'material-ui';
//let thememanager = new mui.styles.thememanager();

export default class App extends Component {
  getChildContext() {
    //return {muiTheme: ThemeManager.getCurrentTheme()};
  }

  setActiveRoute() {
    let appRouteData = _.find(appRoutesData, (appRouteData) => {
      return this.context.router.isActive(appRouteData.route);
    });

    this.setState({activeRoute: appRouteData ? appRouteData.route : '/'});
  }

  componentWillMount() {
    this.setActiveRoute();
    // ThemeManager.setPalette({
    //   accent1Color: mui.Styles.Colors.greenA100,
    //   accent2Color: mui.Styles.Colors.greenA200,
    //   accent3Color: mui.Styles.Colors.greenA400,
    // });
  }

  componentDidMount() {
    componentHandler.upgradeDom();
  }

  componentWillReceiveProps() {
    this.setActiveRoute();
  }

  transitionToRoute = (route) => {
    this.context.router.transitionTo(route);
    this.setState({activeRoute: route});
  }

  transitionToHome = () => {
    this.transitionToRoute('/');
  }

  render(){
    return (
      <AppLayout>
        <AppHeader/>
        <AppSlidingMenu/>
        <AppMain/>
      </AppLayout>
    )
  }
}

class AppMain extends Component {
  render(){
    return (
      <main className="mdl-layout__content" style={{padding: '10px'}}>
        <Router.RouteHandler />
      </main>
    )
  }
}

class AppLayout extends Component {
  render(){
   
    return (
        <div className="app-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
          {this.props.children}
        </div>
    )
  }
}

class AppHeader extends Component {
  render(){
    return(
      <header className="app-header mdl-layout__header mdl-color--white mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">TimeTrack by redpelicans</span>
          <div className="mdl-layout-spacer"></div>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
            <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search">
              <i className="material-icons">search</i>
            </label>
            <div className="mdl-textfield__expandable-holder">
              <input className="mdl-textfield__input" type="text" id="search" />
              <label className="mdl-textfield__label" htmlFor="search">Enter your query...</label>
            </div>
          </div>
          <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
            <i className="material-icons">more_vert</i>
          </button>
          <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
            <li className="mdl-menu__item">About</li>
            <li className="mdl-menu__item">Contact</li>
            <li className="mdl-menu__item">Legal information</li>
          </ul>
        </div>
      </header>
    )
  }
}

class AppSlidingMenu extends Component {
  render(){
    return (
      <div className="app-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
        <header className="app-drawer-header">
          <Avatar src="images/user.jpg"/>
          <div className="app-avatar-dropdown">
            <span>eric.basley@redpelicans.com</span>
            <div className="mdl-layout-spacer"></div>
            <button id="accbtn" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
              <i className="material-icons" role="presentation">arrow_drop_down</i>
              <span className="visuallyhidden">Accounts</span>
            </button>
            <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="accbtn">
              <li className="mdl-menu__item">Logout</li>
              <li className="mdl-menu__item"><i className="material-icons">add</i>Switch to an other account</li>
            </ul>
          </div>
        </header>
        <AppNavigationMenu/>
      </div>
    )
  }
}

class AppNavigationMenu extends Component {
  render(){
    let menu = appRoutesData.filter(routeData =>  routeData.isMenu).map( e => {
      return <a className="mdl-navigation__link" href={`/#/${e.route}`}><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">{e.iconName}</i>{e.label}</a>
    });

    return (
      <nav className="app-navigation mdl-navigation mdl-color--blue-grey-800">
        {menu}
        <div className="mdl-layout-spacer"></div>
        <a className="mdl-navigation__link" href="/#/home"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">help_outline</i><span className="visuallyhidden">Help</span></a>
      </nav>
    )
  }

}

App.childContextTypes = {muiTheme: React.PropTypes.object};
App.contextTypes = {router: React.PropTypes.func};

