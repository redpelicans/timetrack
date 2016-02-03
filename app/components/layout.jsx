import React, {Component} from 'react';


export class Content extends Component {
  render(){
    return (
      <div className="col-xs-12 col-md-8 col-md-offset-2">
        {this.props.children}
      </div>
    )
  }
}
