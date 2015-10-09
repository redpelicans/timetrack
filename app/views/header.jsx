import React, {Component} from 'react';

export default class Header extends Component {

  componentDidMount(){
  }

  render() {
    let styles={
      header:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '75px',
        fontSize: 'x-large',
        boxShadow: '0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0  rgba(0,0,0,.12)',
      },
      barButton:{
        order: 0,
        flex: '1 0 auto',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      title:{
        order: 1,
        flex: '10 0 auto'
      },
      options:{
        order: 2,
        flex: '10 1 auto'
      }
    }

    return (
      <div style={styles.header}>
        <div style={styles.barButton}>
          {this.props.buttonMenu}
        </div>
        <div style={styles.title}>
          <span> {this.props.title} </span>
        </div>
        <div style={styles.options}>
          {this.props.children}
        </div>
      </div>
    )
  }

}


