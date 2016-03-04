import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import FileInput from 'react-file-input';
import Remarkable from 'remarkable';
import {colors} from '../forms/company';
import ReactTooltip from 'react-tooltip';

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

AvatarView.propTypes = {
  obj:    PropTypes.object,
  size:   PropTypes.number,
  label:  PropTypes.string
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
        <div>
          <img data-tip={this.props.label} src={this.props.src} style={imageStyle}/>
          <ReactTooltip effect="solid" />
        </div>
      )
    }else{
      return (
        <div>
          <div data-tip={this.props.label} style={initialsStyle}>{this.getInitials(this.props.name)}</div>
          <ReactTooltip effect="solid" />
        </div>
      )
    }
  }

}

Avatar.propTypes = {
  size:   PropTypes.number,
  color:  PropTypes.string,
  src:    PropTypes.string,
  label:  PropTypes.string
}

export const NewLabel = () => {
  return (
    <span className="label label-success">new</span>
  )
}

export const UpdatedLabel = () => {
  return (
    <span className="label label-info">updated</span>
  )
}

export const TextLabel = ({label, value, url, onClick}) => {
  const labelUrl = () => {
    if(!url && !onClick) return "";
    if(onClick) return <a href="#" onClick={onClick}><i className="fa fa-external-link p-l-1"/></a>;
    if(url) return <a href={url}><i className="fa fa-external-link p-l-1"/></a>;
  }

  return(
    <fieldset className="form-group">
      <label htmlFor={label}>
        {label}
        {labelUrl()}
      </label>
      <span className="form-control" id={label}>{value}</span>
    </fieldset>
  )
}

TextLabel.proptypes = {
  label:    PropTypes.string,
  value:    PropTypes.string,
  url:      PropTypes.string,
  onClick:  PropTypes.func
}

export const Labels = ({label, value, onClick}) => {
  const styles = {
    label:{
      color: '#cfd2da',
      padding: '.3rem',
    }
  };

  const handleClick = (label, e) => {
    onClick(label);
    e.preventDefault();
  }

  let labels;
  if(!onClick){
   labels = _.map(value.toJS(), v => <span key={v} style={styles.label} className="label label-primary m-r-1">{v}</span>);
  }else{
   labels = _.map(value.toJS(), v => {
    return (
      <span key={v} style={styles.label} className="label label-primary m-r-1">
        <a href="#" onClick={handleClick.bind(null, v)}>{v}</a>
      </span>
    )
   })
  }

  return(
    <fieldset className="form-group">
      <label htmlFor={label}>
        {label}
      </label>
      <div className="form-control" id={label}>
        {labels}
      </div>
    </fieldset>
  )
}

Labels.propTypes = {
  label:    PropTypes.string,
  value:    PropTypes.object,
  onClick:  PropTypes.func
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

MarkdownText.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string
}

export const GoBack = ({history, goBack, isLoading}) => {
  const handleChange = (e) => {
    if(goBack) goBack();
    else history.goBack();
    e.preventDefault();
  }

  if (isLoading) {
      return (<i className="fa fa-spinner fa-spin m-r-1"/>)
  }
  else {
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-arrow-left m-r-1"/>
      </a>
    )
  }
}

GoBack.propTypes = {
  history:    PropTypes.object,
  goBack:     PropTypes.func,
  isLoading:  PropTypes.bool
}

export const Title =({title}) => {
  const styles={
    name:{
      flexShrink: 0,
    },
  }

  return (
    <div style={styles.name} className="m-r-1">
      {title}
    </div>
  )
}

Title.propTypes = {
  title: PropTypes.string
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

HeaderLeft.propTypes = {
  children: PropTypes.node
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

HeaderRight.propTypes = {
  children: PropTypes.node
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

Header.propTypes = {
  obj:      PropTypes.object,
  children: PropTypes.node
}

export const Form = ({children}) => {
  return(
    <form>
      {children}
    </form>
  )
}

Form.propTypes = {
  children: PropTypes.node
}

export const AddBtn = ({onSubmit, canSubmit}) => {
  const handleChange = (e) => {
    onSubmit();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-primary m-l-1" disabled={!canSubmit} onClick={handleChange}>Create</button>
  )
}

AddBtn.propTypes = {
  onSubmit:   PropTypes.func.isRequired,
  canSubmit:  PropTypes.bool
}

export const UpdateBtn = ({onSubmit, canSubmit, label, size}) => {
  const handleChange = (e) => {
    onSubmit();
    e.preventDefault();
  }

  const classnames = classNames("btn btn-primary m-l-1", {
    'btn-sm': size === 'small',
    'btn-lg': size === 'large',
  });

  return (
    <button type="button" className={classnames} disabled={!canSubmit} onClick={handleChange}>{label || 'Update'}</button>
  )
}

UpdateBtn.propTypes = {
  onSubmit:   PropTypes.func.isRequired,
  canSubmit:  PropTypes.bool,
  label:      PropTypes.string,
  size:       PropTypes.string
}

export const CancelBtn = ({onCancel, label, size}) => {
  const handleChange = (e) => {
    onCancel();
    e.preventDefault();
  }

  const classnames = classNames("btn btn-warning m-l-1", {
    'btn-sm': size === 'small',
    'btn-lg': size === 'large',
  });

  return (
    <button type="button" className={classnames} onClick={handleChange}>{label || 'Cancel'}</button>
  )
}

CancelBtn.propTypes = {
  onCancel:   PropTypes.func.isRequired,
  label:      PropTypes.string,
  size:       PropTypes.string
}

export const ResetBtn = ({obj, label, size}) => {
  const handleChange = (e) => {
    obj.reset();
    e.preventDefault();
  }

  const classnames = classNames("btn btn-danger m-l-1", {
    'btn-sm': size === 'small',
    'btn-lg': size === 'large',
  });

  return (
    <button type="button" className={classnames} onClick={handleChange}>{label || 'Reset'}</button>
  )
}

ResetBtn.propTypes = {
  obj:    PropTypes.object.isRequired,
  label:  PropTypes.string,
  size:   PropTypes.string
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
    <div className="m-l-1">
      <a href="#" onClick={handleChange}>
        <i style={style} className="iconButton fa fa-refresh"/>
      </a>
    </div>
  )
}

Refresh.propTypes = {
  onClick: PropTypes.func.isRequired
}

export const Filter = ({filter, onChange, onReset}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
    e.preventDefault();
  }

  const handleClick = (e) => {
    onReset();
    e.preventDefault();
  }

  const styles={
    container:{
      position: 'relative',
    },
    icon:{
      position: 'absolute',
      padding: '10px',
      right: '0px',
      top: '-1px',
      fontSize: '1.2rem',
      zIndex: 10,
      color: 'grey',
    }
  }

  const icon= <span className="fa fa-search"/>;

  return (
    <div className="m-l-1" style={styles.container}>
      <input className="tm input form-control" type='text' value={filter} placeholder='search ...' onChange={handleChange}/>
      <a href="#">
        <i className="fa fa-ban" style={styles.icon} onClick={handleClick}/>
      </a>
    </div>
  )
}

Filter.propTypes = {
  onChange: PropTypes.func.isRequired,
  onReset:  PropTypes.func.isRequired,
  filter: PropTypes.string
}

export const FilterPreferred = ({preferred, onClick}) => {
  const handleChange = (e) => {
    onClick();
    e.preventDefault();
  }

  const style={
    fontSize: '1.5rem',
    color: preferred ? '#00BCD4' : 'grey',
  }

  return (
    <div className="m-l-1">
      <a href="#" onClick={handleChange} >
        <i style={style} className="iconButton fa fa-star-o"/>
      </a>
    </div>
  )
}

FilterPreferred.propTypes = {
  preferred:  PropTypes.bool,
  onClick:    PropTypes.func.isRequired
}

export const Sort = ({sortMenu, sortCond, onClick}) => {
  const handleClick = (mode, e) => {
    onClick(mode);
    e.preventDefault();
  }

  function getSortIcon(sortCond, item){
    if(item.key === sortCond.by){
      const classnames = sortCond.order === "desc" ? "fa fa-sort-desc p-l-1" : "fa fa-sort-asc p-l-1";
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
    <div className="dropdown m-l-1">
      <a href="#"  id="sort-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        <i style={styles.button} className="iconButton fa fa-sort" />
      </a>
      <ul style={styles.menu} className="dropdown-menu dropdown-menu-right" aria-labelledby="sort-menu">
        {menu}
      </ul>
    </div>
  )
}

Sort.propTypes = {
  sortMenu: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortCond: PropTypes.object.isRequired,
  onClick:  PropTypes.func.isRequired
}

export const TitleIcon =({icon, isLoading}) => {
  return isLoading ? <i className="fa fa-spinner fa-spin m-r-1"/> : <i className={`fa fa-${icon} m-r-1`}/>;
}

TitleIcon.propTypes = {
  icon:       PropTypes.string.isRequired,
  isLoading:  PropTypes.bool
}
