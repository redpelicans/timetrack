import React, {Component} from 'react';
import classNames from 'classnames';
import FileInput from 'react-file-input';
import Remarkable from 'remarkable';


export const AvatarView = ({obj, size, label}) => {
  if(!obj || !obj.get('avatar')) return <div className="m-r-1"><Avatar size={size} name={"?"}/></div>;

  const avatar = obj.get('avatar').toJS();
  const tooltip = label || obj.get('name');
  const defaultAvatar = <div className="m-r-1"><Avatar size={size} label={tooltip} name={obj.get('name')} color={avatar.color}/></div>;

  switch(avatar.type){
    case 'url':
      return avatar.url ? <div className="m-r-1"><Avatar size={size} label={tooltip} src={avatar.url}/></div> : defaultAvatar;
    case 'src':
      return avatar.src ? <div className="m-r-1"><Avatar size={size} label={tooltip} src={avatar.src}/></div> : defaultAvatar;
    default:
      return defaultAvatar;
  }
}

export class Avatar extends Component {
  rndColor() {
    let colors = ['#d73d32', '#7e3794', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080'];
    let index = Math.floor(Math.random()*colors.length);
    return colors[ index ];
  }

  getInitials(name=''){
    let parts = name.split(' ').slice(0, 3);
    return _.map(parts, part => part.substr(0,1).toUpperCase()).join('');
  }

  componentWillUnmount(){
    $('[data-toggle="tooltip"]').tooltip('dispose');
  }

  componentDidMount(){
    $('[data-toggle="tooltip"]').tooltip();
  }

  render(){
    const size = this.props.size || 36;
    const styleSize = `${size}px`;
    const imageStyle =  {
      width: styleSize || '36px',
      height: styleSize || '36px',
      borderRadius: '50%'
    };

    const initialsStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: this.props.color || this.rndColor(),
      width: styleSize || '36px',
      height: styleSize || '36px',
      color: '#FFF',
      textTransform: 'uppercase',
      borderRadius: '50%',
      fontSize: `${size/36}rem`,
    }

    if(this.props.src){
      return (
        <div data-toggle="tooltip" data-placement="top" title={this.props.label}>
          <img src={this.props.src} style={imageStyle}/>
        </div>
      )
    }else{
      return <div data-toggle="tooltip" data-placement="top" title={this.props.label} style={initialsStyle}>{this.getInitials(this.props.name)}</div>
    }
  }

}
