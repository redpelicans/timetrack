import React, {Component, PropTypes} from 'react';


export class Content extends Component {
  render(){
    const style={
      height: '100%',
    }
    return (
      <div style={style} className="col-xs-12 col-md-8 col-md-offset-2">
        {this.props.children}
      </div>
    )
  }
}

Content.propTypes = {
  children: PropTypes.node
}
