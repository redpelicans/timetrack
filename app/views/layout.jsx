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

export class Header extends Component {
  render(){
    let style={
      paddingTop: '1rem',
    }
    return (
      <div className="row" style={style}>
        <div className="col-md-6 tm title">
          {this.props.leftIcon}
          {this.props.title}
        </div>
        <div className="col-md-6">
          {this.props.children}
        </div>
        <div className="col-md-12">
          <hr/>
        </div>
      </div>
    )
  }
}

export class Actions extends Component {
  render(){
    let styles={
      actions:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        fontSize: '0.9rem',
      },
    }
    return (
      <div style={styles.actions}>
        {this.props.children}
      </div>
    )
  }
}
