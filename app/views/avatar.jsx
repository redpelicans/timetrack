import React, {Component} from 'react';

export default class Avatar extends Component {
  render(){
    let styles = {
      avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '24'
      }
    }

    return (
      <img src={this.props.src} style={styles.avatar}/>
    )
  }

}

