import _ from 'lodash';
import React, {Component} from 'react';
import Router from 'react-router';
import routeData from './routes';
import Avatar from './components/avatar/app';
import Layout, { Header, Navigation, HeaderRow, HeaderTabs, Drawer, Content } from 'react-mdl/lib/layout/Layout';
import Textfield from 'react-mdl/lib/Textfield';
import IconButton from 'react-mdl/lib/IconButton';
import Menu, { MenuItem } from 'react-mdl/lib/Menu';

//import injecttapeventplugin from 'react-tap-event-plugin';
//injecttapeventplugin();



export default class App extends Component {

  render(){
    return (
      <Layout className="mdl-color--grey-100">
        <Header className="mdl-color--white mdl-color--grey-100 mdl-color-text--grey-600">
          <HeaderRow title="Timetrack by redpelicans">
            <Textfield
                value=""
                onChange={() => {}}
                label="Search"
                expandable={true}
                expandableIcon="search"
            />
          </HeaderRow>
        </Header>
        <AppSlidingMenu location={this.props.location} history={this.props.history}/>
        <Content>
          {this.props.children}
        </Content>
      </Layout>
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
        <AppNavigationMenu location={this.props.location} history={this.props.history}/>
      </div>
    )
  }
}

class AppNavigationMenu extends Component {
  render(){
    let location = this.props.location;
    let menu = routeData.filter(route => route.isMenu).map( e => {
      // console.log(location)
      // let isActive = this.props.history.isActive(location.pathname)
      // console.log(e.path, isActive)

      //console.log(this.props.history);

      return <a className="mdl-navigation__link" key={e.path} href={`/#/${e.path}`}><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">{e.iconName}</i>{e.label}</a>
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

App.contextTypes = {router: React.PropTypes.func};

