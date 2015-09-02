import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import routes, {appRoutesData} from './routes';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import mui from 'material-ui';
let ThemeManager = new mui.Styles.ThemeManager();

class App extends React.Component {

  getChildContext() {
    return {muiTheme: ThemeManager.getCurrentTheme()};
  }

  setActiveRoute(){
    let appRouteData = _.find(appRoutesData, (appRouteData) => {
      return this.context.router.isActive(appRouteData.route);
    });

    this.setState({activeRoute: appRouteData ? appRouteData.route : '/'});
  }

  componentWillMount() {
    this.setActiveRoute();
    ThemeManager.setPalette({
      accent1Color: mui.Styles.Colors.greenA100,
      accent2Color: mui.Styles.Colors.greenA200,
      accent3Color: mui.Styles.Colors.greenA400,
    });
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

  render() {
    let styles = {
      paper: {
        backgroundColor: ThemeManager.getCurrentTheme().palette.primary1Color,
        position: 'fixed',
        height: ThemeManager.getCurrentTheme().component.appBar.height,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1
      },
      tabsContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0
      },
      tabs: {
        width: 300,
        bottom: 0
      },
      tab: {
        height: ThemeManager.getCurrentTheme().component.appBar.height
      },
      titleContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: ThemeManager.getCurrentTheme().component.appBar.height,
        color: ThemeManager.getCurrentTheme().component.appBar.textColor
      },
      titleIconButton: {
        top: 5
      },
      titleIcon: {
        color: ThemeManager.getCurrentTheme().component.appBar.textColor
      },
      contentContainer: {
        paddingTop: ThemeManager.getCurrentTheme().component.appBar.height
      }
    };

    return (
      <div>
        <mui.Paper zDepth={0} rounded={false} style={styles.paper}>
          <div style={styles.titleContainer}>
            <mui.IconButton
              style={styles.titleIconButton}
              iconClassName="material-icons"
              iconStyle={styles.titleIcon}
              onFocus={this.transitionToHome}
            >
              home
            </mui.IconButton>
            <strong>timetrack</strong>
            <small>wonderfull.slogan.goes.here</small>
          </div>
          <div style={styles.tabsContainer}>
            <mui.Tabs
              onChange={this.transitionToRoute}
              value={this.state.activeRoute}
              style={styles.tabs}
            >
              {appRoutesData.map((tab) => {
                return (
                  <mui.Tab
                    key={tab.route}
                    value={tab.route}
                    label={tab.label}
                    route={tab.route}
                    style={styles.tab}
                  />
                );
              })}
            </mui.Tabs>
          </div>
        </mui.Paper>
        <div style={styles.contentContainer}>
          <Router.RouteHandler />
        </div>
      </div>
    );
  }
}

App.childContextTypes = {muiTheme: React.PropTypes.object};
App.contextTypes = {router: React.PropTypes.func};

export default App;
