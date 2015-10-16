import React, {Component} from 'react';
import Header from './header';
import MainButtonMenu from './main_button_menu';

export default class HomeApp extends Component{
  static contextTypes = {
    toggleSideBar: React.PropTypes.func.isRequired
  }

  componentDidMount(){
  }

  render(){
    let buttonMenu = (
      <MainButtonMenu onClick={this.context.toggleSideBar}/>
    )

    return (
      <div>
        <Header title={'Timetrack by Redpelicans'} buttonMenu={buttonMenu}/>
        <div className="content">
          <h1>Home Sweet Home ...</h1>
        </div>
      </div>
    )
  }


}

