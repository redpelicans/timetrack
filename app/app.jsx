import React, {Component} from 'react';
import Router from 'react-router';
import SideBar from 'react-sidebar';
import AppBar from './views/appbar';
import Nav from './models/nav.js';
import ReactToastr from 'react-toastr';
let {ToastContainer} = ReactToastr;
let ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);


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
    this.refs.container.success(
      "Welcome welcome welcome!!",
      "You are now home my friend. Welcome home my friend.", 
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

  render(){
    let styles={
      toast:{
        position: 'fixed',
        zIndex: 999999,
        pointerEvents: 'None',
        top: '100px',
        right: '12px'
      }
    }
    let sidebarContent = <AppBar currentTopic={this.state.currentTopic} toggleSideBar={this.onToggleSidebar}/>
    return (
      <SideBar sidebar={sidebarContent}  open={this.state.sidebarOpen} onSetOpen={this.onSetSidebarOpen} toggleSideBar={this.onToggleSidebar}>
        {this.props.children}
        <ToastContainer style={styles.toast} ref="container" toastMessageFactory={ToastMessageFactory} />
      </SideBar>
    )
  }
}

App.contextTypes = {router: React.PropTypes.func};

