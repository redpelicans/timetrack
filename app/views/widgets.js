import React, {Component} from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import FileInput from 'react-file-input';
import Remarkable from 'remarkable';
import {colors} from '../forms/company';


export const AvatarView = ({obj}) => {
  if(!obj || !obj.get('avatar')) return <Avatar name={"?"}/>;

  const avatar = obj.get('avatar').toJS();
  //console.log("AvatarView")
  const defaultAvatar = <div className="m-r"><Avatar name={obj.get('name')} color={avatar.color}/></div>;

  switch(avatar.type){
    case 'url':
      return avatar.url ? <div className="m-r"><Avatar src={avatar.url}/></div> : defaultAvatar;
    case 'src':
      return avatar.src ? <div className="m-r"><Avatar src={avatar.src}/></div> : defaultAvatar;
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

export const TextLabel = ({label, value, url, onClick}) => {
  const labelUrl = () => {
    if(!url && !onClick) return "";
    if(onClick) return <a href="#" onClick={onClick}><i className="fa fa-external-link p-l"/></a>;
    if(url) return <a href={url}><i className="fa fa-external-link p-l"/></a>;
  }

  return(
    <fieldset className="form-group">
      <label htmlFor={label}> 
        {label} 
        {labelUrl}
      </label>
      <span className="form-control" id={label}>{value}</span>
    </fieldset>
  )
}

export const MarkdownText = ({label, value}) => {
  const md = new Remarkable();
  const text = {__html: md.render(value)};
  return(
    <fieldset className="form-group">
      <label htmlFor={label}> 
        {label} 
      </label>
      <div style={{height: '100%', minHeight: '36px'}}className="form-control" id={label} dangerouslySetInnerHTML={text}/>
    </fieldset>
  )
}

export const GoBack =({goBack, history}) => {
  const handleChange = (e) => {
    if(goBack) goBack();
    else history.goBack();
    e.preventDefault();
  }

  return (
    <a href="#" onClick={handleChange}>
      <i className="iconButton fa fa-arrow-left m-r"/>
    </a>
  )
}

export const Title =({title}) => {
  const styles={
    name:{
      flexShrink: 0,
    },
  }

  return (
    <div style={styles.name} className="m-r">
      {title}
    </div>
  )
}

export const HeaderLeft = ({children}) => {
  const styles={
    left:{
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      minWidth: '500px',
    },
  }

  return (
    <div style={styles.left}>
      {children}
    </div>
  )
}

export const HeaderRight = ({children}) => {
  const styles={
    right:{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
    },
  }

  return (
    <div style={styles.right}>
      {children}
    </div>
  )
}

export const Header = ({obj, children}) => {
  const styles={
    container:{
      paddingTop: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    name:{
      flexShrink: 0,
    },
    time: {
      fontSize: '.7rem',
      fontStyle: 'italic',
      display: 'block',
      float: 'right',
    },
  }

  const left = () => {
    return React.Children.toArray(children).find(child => child.type === HeaderLeft);
  };

  const right = () => {
    return React.Children.toArray(children).find(child => child.type === HeaderRight);
  };

  const timeLabels = (obj) => {
    if(!obj || !obj.get('createdAt'))return <span/>;
    const res = [`Created ${obj.get('createdAt').fromNow()}`];
    if(obj.get('updatedAt')) res.push(`Updated ${obj.get('updatedAt').fromNow()}`);
    return <span>{res.join(' - ')}</span>
  }

  const time = () => {
    if(!obj) return "";
    return (
      <div style={styles.time} >
        {timeLabels(obj)}
      </div>
    );
  };

  return (
    <div>
      <div style={styles.container} className="tm title">
        {left()}
        {right()}
      </div>
      <hr/>
      {time()}
    </div>
  )
}


export const Form = ({children}) => {
  return(
    <form>
      {children}
    </form>
  )
}

export const AddBtn = ({onSubmit, canSubmit}) => {
  const handleChange = (e) => {
    onSubmit();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-primary m-l" disabled={!canSubmit} onClick={handleChange}>Create</button>
  )
}

export const UpdateBtn = ({onSubmit, canSubmit}) => {
  const handleChange = (e) => {
    onSubmit();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-primary m-l" disabled={!canSubmit} onClick={handleChange}>Update</button>
  )
}

export const CancelBtn = ({onCancel}) => {
  const handleChange = (e) => {
    onCancel();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-warning m-l" onClick={handleChange}>Cancel</button>
  )
}

export const ResetBtn = ({obj}) => {
  const handleChange = (e) => {
    obj.reset();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-danger m-l"  onClick={handleChange}>Reset</button>
  )
}


export const Refresh =({onClick}) => {
  const handleChange = (e) => {
    onClick();
    e.preventDefault();
  }

  const style={
    fontSize: '1.5rem',
  }

  return (
    <div className="m-l">
      <a href="#" onClick={handleChange}>
        <i style={style} className="iconButton fa fa-refresh"/>
      </a>
    </div>
  )
}

export const Filter =({filter, onChange}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
    e.preventDefault();
  }

  const icon= <span className="fa fa-search"/>
  return (
    <div className="m-l">
      <input className="tm input form-control" type='text' value={filter} placeholder='search ...' onChange={handleChange}/>
    </div>
  )
}

export const FilterPreferred =({preferred, onClick}) => {
  const handleChange = (e) => {
    onClick();
    e.preventDefault();
  }

  const style={
    fontSize: '1.5rem',
    color: preferred ? '#00BCD4' : 'grey',
  }

  return (
    <div className="m-l">
      <a href="#" onClick={handleChange} > 
        <i style={style} className="iconButton fa fa-star-o"/>
      </a>
    </div>
  )
}

export const Sort =({sortMenu, sortCond, onClick}) => {
  const handleClick = (mode, e) => {
    onClick(mode);
    e.preventDefault();
  }

  function getSortIcon(sortCond, item){
    if(item.key === sortCond.by){
      const classnames = sortCond.order === "desc" ? "fa fa-sort-desc p-l" : "fa fa-sort-asc p-l";
      return <i className={classnames}/>
    }
  }

  const styles = {
    button:{
      fontSize: '1.5rem',
    },
    menu:{
      marginTop: '15px',
    }
  }

  const menu = _.map(sortMenu, item => {
    return (
      <a key={item.key} className="dropdown-item p-a" href="#" onClick={handleClick.bind(null, item.key)}>
        {item.label}
        {getSortIcon(sortCond, item)}
      </a>
    )
  });

  return (
    <div className="dropdown m-l">
      <a href="#"  id="sort-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> 
        <i style={styles.button} className="iconButton fa fa-sort" />
      </a>
      <ul style={styles.menu} className="dropdown-menu dropdown-menu-right" aria-labelledby="sort-menu">
        {menu}
      </ul>
    </div>
  )
}



