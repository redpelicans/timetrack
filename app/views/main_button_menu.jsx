import React, {Component} from 'react';


export default class MainButtonMenu extends Component {
  render(){
    return (
      <a href="#" onClick={this.props.onClick} > <i className="material-icons">menu</i> </a>
    )
  }
}

