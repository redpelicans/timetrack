import React, {Component} from 'react';

export default class HomeApp extends Component{
  static contextTypes = {
    toggleSideBar: React.PropTypes.func.isRequired
  }

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
        flex: '20 0 auto'
      }
    }

    return (
      <div>
        <div style={styles.header}>
          <div style={styles.barButton}>
            <a href="#" onClick={this.context.toggleSideBar} > <i className="material-icons">menu</i> </a>
          </div>
          <div style={styles.title}>
            <span> TimeTrack By Redpelicans </span>
          </div>
        </div>
        <div className="content">
          <h1>Home Sweet Home ...</h1>
        </div>
      </div>
    )
  }
}

