import React, {Component} from 'react';
import _ from 'lodash';

export default class Avatar extends Component {
  rndColor() {
    let colors = ['#d73d32', '#7e3794', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080'];
    let index = Math.floor(Math.random()*colors.length);
    return colors[ index ];
  }

  getInitials(name=''){
    let parts = name.split(' ').slice(0, 3);
    return _.map(parts, part => part.substr(0,1).toUpperCase());
  }

  render(){
    let imageStyle =  {
      width: this.props.size || '36px',
      height: this.props.size || '36px',
      borderRadius: '50%'
    };

    let initialsStyle = {
      background: this.props.color || this.rndColor(),
      width: this.props.size || '36px',
      height: this.props.size || '36px',
      color: '#FFF',
      textAlign: 'center',
      textTransform: 'uppercase',
      borderRadius: '50%',
      paddingTop: '8px',
    }

    if(this.props.src){
      return (
        <div style={this.props.css}>
          <img src={this.props.src} style={imageStyle}/>
        </div>
      )
    }else{
      return <div style={_.extend(initialsStyle, this.props.css)}>{this.getInitials(this.props.name)}</div>
    }
  }

}

