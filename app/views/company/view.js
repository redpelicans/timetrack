import _ from 'lodash';
import Remarkable from 'remarkable';
import React, {Component} from 'react';
import routes from '../../routes';
import classNames from 'classnames';
import {AvatarView, timeLabels} from './helpers';
import {Content } from '../layout';
import companies from '../../models/companies';

export default class ViewCompanyApp extends Component {
  state = {company: undefined};

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  componentWillUnmount(){
    this.unsubscribeLoadOne();
  }

  componentWillMount() {
    const companyId = this.props.location.state.id;
    this.unsubscribeLoadOne = companies.loadOne(companyId).onValue(company => {
      this.setState({company: company});
    });
  }

  goBack = () => {
    this.props.history.goBack();
  }

  handleEditCompany = (company) => {
    this.props.history.pushState({id: company._id}, routes.editcompany.path);
  }

  handleDeleteCompany = (company) => {
    let answer = confirm(`Are you sure to delete the company "${company.name}"`);
    if(answer){
      companies.delete(company).then( () => {
        this.goBack();
      });
    }
  }

  render(){
    if(!this.state.company) return false;
    return (
      <Content>
        <Header company={this.state.company} goBack={this.goBack} onEdit={this.handleEditCompany} onDelete={this.handleDeleteCompany}/>
        <CompanyCard company={this.state.company}/>
      </Content>
    )
  }
}

const CompanyCard = ({company}) =>  {
  const styles={
    container:{
      marginTop: '3rem',
    },
  }

  return (
    <div style={styles.container} className="row" >
      <div className="col-md-4 ">
        <TextLabel label="Type" value={company.type}/>
      </div>
      <div className="col-md-8 ">
        <TextLabel isUrl={true} label="website" value={company.website}/>
      </div>
      <div className="col-md-5">
        <TextLabel label="Street" value={company.address && company.address.street}/>
      </div>
      <div className="col-md-2">
        <TextLabel label="Zip Code" value={company.address && company.address.zipcode}/>
      </div>
      <div className="col-md-2">
        <TextLabel label="City" value={company.address && company.address.city}/>
      </div>
      <div className="col-md-3">
        <TextLabel label="Country" value={company.address && company.address.country}/>
      </div>
      <div className="col-md-12">
        <MarkdownText label="Note" value={company.note}/>
      </div>
    </div>
  )
}

const Header = ({company, goBack, onEdit, onDelete}) => {
  const avatar = <AvatarView company={company}/>;
  const styles={
    container:{
      paddingTop: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    left:{
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      minWidth: '500px',
    },
    right:{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
    },
    name:{
      flexShrink: 0,
    },
    starred:{
      color: company.starred ? '#00BCD4' : 'grey',
    },
    time: {
      fontSize: '.7rem',
      fontStyle: 'italic',
      display: 'block',
      float: 'right',
    },
  }

  const handleClick = (e) => {
    e.preventDefault();
    goBack();
  }

  return (
    <div>
      <div style={styles.container} className="tm title">
        <div style={styles.left}>
          <div>
            <a href="#" className="fa fa-arrow-left m-r" onClick={handleClick}/>
          </div>
          <div className="m-r">
            {avatar}
          </div>
          <div style={styles.name} className="m-r">
            {company.name}
          </div>
          <div>
            <i style={styles.starred} className="fa fa-star-o m-r"/>
          </div>
        </div>
        <div style={styles.right}>
          <EditCompany company={company} onEdit={onEdit}/>
          <DeleteCompany company={company} onDelete={onDelete}/>
        </div>
      </div>
      <hr/>
      <div style={styles.time} >
        {timeLabels(company)}
      </div>
    </div>
  )
}

class StarredCompany extends Component{
  render(){
    const company = this.props.company;
    const style={
      get color(){ return company.starred ? '#00BCD4' : 'grey'; },
      //fontSize: '1.2rem',
    };

    return (
      <i style={style} className="iconButton fa fa-star-o"/>
    )
  }
}

const TextLabel = ({label, value, isUrl}) => {
  const labelUrl = isUrl ? <a href={value}><i className="fa fa-external-link p-l"/></a> : "";
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

const MarkdownText = ({label, value}) => {
  const md = new Remarkable();
  const text = {__html: md.render(value)};
  return(
    <fieldset className="form-group">
      <label htmlFor={label}> 
        {label} 
      </label>
      <div style={{height: '100%'}}className="form-control" id={label} dangerouslySetInnerHTML={text}/>
    </fieldset>
  )
}

const EditCompany = ({company, onEdit}) => {
  const handleChange = (e) => {
    onEdit(company);
    e.preventDefault();
  }

  let style={
    fontSize: '1.2rem',
    color: 'grey',
  };

  return (
    <a href="#" onClick={handleChange}>
      <i style={style} className="iconButton fa fa-pencil m-r"/>
    </a>
  )
}

const DeleteCompany =({company, onDelete}) => {
  const handleChange = (e) => {
    onDelete(company);
    e.preventDefault();
  }

  let style={
    fontSize: '1.2rem',
    color: 'grey',
  };

  return (
    <a href="#" onClick={handleChange}>
      <i style={style} className="iconButton fa fa-trash m-r"/>
    </a>
  )
}


