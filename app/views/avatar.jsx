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
    return _.map(parts, part => part.substr(0,1).toUpperCase()).join('');
  }

  render(){
    let imageStyle =  {
      width: this.props.size || '36px',
      height: this.props.size || '36px',
      borderRadius: '50%'
    };

    let initialsStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: this.props.color || this.rndColor(),
      width: this.props.size || '36px',
      height: this.props.size || '36px',
      color: '#FFF',
      textTransform: 'uppercase',
      borderRadius: '50%',
      fontSize: '1rem',
    }

    if(this.props.src){
      return (
        <div>
          <img src={this.props.src} style={imageStyle}/>
        </div>
      )
    }else{
      return <div style={initialsStyle}>{this.getInitials(this.props.name)}</div>
    }
  }

}

