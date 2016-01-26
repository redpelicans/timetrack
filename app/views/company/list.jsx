import React, {Component} from 'react';

export default class ListApp extends Component {

  render(){
    const styles = {
      wip:{
        margin: '200px',
      }
    };

    return (
      <div style={styles.wip}>
        <span>
          Start from here and good luck ...
        </span>
      </div>
    )
  }

}
