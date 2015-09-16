import React, {Component} from 'react';

export default class Avatar extends Component {
  render(){
    let styles = {
      avatar: {
        width: '48px',
        height: '48px',
        borderRadius: '24'
      }
    }

    return (
      <img src={this.props.src} style={styles.avatar}/>
    )
  }

}

