import React, {Component} from 'react';
import Router from 'react-router';
import SideBar from 'react-sidebar';
import AppBar from './views/appbar';
import Nav from './models/nav.js';

//import injecttapeventplugin from 'react-tap-event-plugin';
//injecttapeventplugin();


export default class App extends Component {

  static childContextTypes = {
    toggleSideBar: React.PropTypes.func,
    history: React.PropTypes.object,
    currentTopic: React.PropTypes.string,
  }

  componentDidMount(){
    //console.log("==========> app mounted ...")
  }

  getChildContext(){
    return {
      toggleSideBar: this.onToggleSidebar,
      history: this.props.history,
      currentTopic: this.state.currentTopic,
    };
  }

  state = {sidebarOpen: false}

  onSetSidebarOpen = (open) => {
    this.setState({sidebarOpen: open});
  }

  onToggleSidebar = () => {
    this.setState({sidebarOpen: !this.state.sidebarOpen});
  }

  componentDidMount(){
    Nav.property.onValue(topic => {
      this.setState({currentTopic: topic.currentTopic});
    });
  }

  render(){
    let sidebarContent = <AppBar currentTopic={this.state.currentTopic} toggleSideBar={this.onToggleSidebar}/>
    return (
      <SideBar sidebar={sidebarContent}  open={this.state.sidebarOpen} onSetOpen={this.onSetSidebarOpen} toggleSideBar={this.onToggleSidebar}>
        {this.props.children}
      </SideBar>
    )
  }
}

App.contextTypes = {router: React.PropTypes.func};

