import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import routes from '../../routes';
import {Content, Header, Actions} from '../layout';
import Avatar from '../avatar';
import classNames from 'classnames';
//import Header from '../header';
//import MainButtonMenu from '../main_button_menu';
import companies from '../../models/companies';

export default class CompanyListApp extends Component {

  static contextTypes = {
  }

  state = { 
    companies: []
  };

  componentWillMount() {
    this.unsubscribeModel = companies.state.onValue( state => {
      this.setState(state);
    });
    companies.load();
  }

  componentWillUnmount() {
    this.unsubscribeModel();
  }

  handleRefresh = () => {
    companies.load();
  }

  handleStarred = () => {
    companies.toggleStarFilter();
  }

  handleSort = (mode) => {
    companies.sort(mode)
  }

  handleSearchFilter = (filter) => {
    companies.searchFilter(filter);
  }

  handleAddCompany = () => {
    this.props.history.pushState(null, routes.newcompany.path);
  }

  handleEditCompany = (company) => {
    this.props.history.pushState({id: company._id}, routes.editcompany.path);
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.companies !== nextState.companies || 
      this.state.searchFilter != nextState.searchFilter || 
      this.state.sortCond != nextState.sortCond || 
      this.state.starFilter != nextState.starFilter;
  }

  render(){
    let leftIcon = <i className="fa fa-building m-a"/>;
    return (
      <Content>
        <Header leftIcon={leftIcon} title={'Companies'}>
          <Actions>
            <Filter filter={this.state.searchFilter} onChange={this.handleSearchFilter}/>
            <Sort sortCond={this.state.sortCond} onClick={this.handleSort}/>
            <Starred starred={this.state.starFilter} onClick={this.handleStarred}/>
            <Refresh onClick={this.handleRefresh}/>
          </Actions>
        </Header>
        <CompanyList model={this.state} onEdit={this.handleEditCompany}/>
        <AddCompanyButton onAddCompany={this.handleAddCompany}/>
      </Content>
    )
  }

}


class CompanyList extends Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props.model.companies !== nextProps.model.companies;
  }

  render(){
    let styles={
      container:{
        marginTop: '50px',
        marginBottom: '50px',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      item:{
        height: '80px',
      }
    }

    let companies = this.props.model.companies;
    let data = companies.map( company => {
      return (
        <div key={company.get('_id')} className="col-md-6 tm list-item" style={styles.item}> 
          <CompanyListItem company={company} onEdit={this.props.onEdit}/>
        </div>
      )
    });

    return (
      <div className="row" style={styles.container}>
        {data}
      </div>
    )
  }

}

class CompanyListItem extends Component {
  shouldComponentUpdate(nextProps, nextState){
    return this.props.company !== nextProps.company;
  }

  handleCompanySelection = (company) => {
    console.log(`CLIENT SELECTION ${company._id}`)
  }

  render() {
    function phone(company){
      if(!company.phones || !company.phones.length) return '';
      let {label, phone} = company.phones[0];
      return `tel. ${label}: ${phone}`;
    }

    function amount(value){
      if(!value) return;
      return `${Math.round(value/1000)} k€`;
    }


    function billAmount(company, type){
      const name = {billed: 'Billed', billable: 'Billable'};
      if(company[type]){
        return (
          <div style={styles[type]}>
            <span>{name[type]}: {amount(company[type] || 0 )}</span>
          </div>
        )
      }else{
        return <div style={styles[type]}/>
      }
    }

    function billAmounts(company){
      if(company.billed || company.billable){
        return (
          <span className="label label-default">{[amount(company.billed), amount(company.billable)].join(' / ')}</span>
        )
      }
    }

    let styles = {
      container:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
      },
      containerLeft:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        padding: '5px',
      },
      containerRight:{
        display: 'flex',
        justifyContent: 'right',
        alignItems: 'center',
        padding: '5px',
      }
    };

    let company = this.props.company.toJS();
    let avatar = company.logoUrl ? <Avatar src={company.logoUrl}/> : <Avatar color={company.color} name={company.name}/>;
    let isNew = company.isNew ? <span className="label label-success">new</span> : <div/>
    return (
      <div style={styles.container}>
        <div style={styles.containerLeft} href="#">
          <div className="p-r">
            {avatar}
          </div>
          <div className="p-r">
            <span>{company.name}</span>
          </div>
          <div className="p-r">
            {billAmounts(company)}
          </div>
          <div className="p-r">
            {isNew}
          </div>
        </div>
        <div style={styles.containerRight} href="#">
          <StarredCompany company={this.props.company}/>
          <EditCompany company={this.props.company} onEdit={this.props.onEdit}/>
        </div>
      </div>
    );
  }
}

class EditCompany extends Component{
  handleChange = (e) => {
    this.props.onEdit(this.props.company.toJS());
    e.preventDefault();
  }

  render(){
    let style={
      fontSize: '1.2rem',
      color: 'grey',
    };

    return (
      <a href="#" onClick={this.handleChange}>
        <i style={style} className="iconButton fa fa-pencil m-r"/>
      </a>
    )
  }
}



class StarredCompany extends Component{
  handleChange = (e) => {
    companies.toggleStar(this.props.company.toJS());
    e.preventDefault();
  }

  render(){
    let company = this.props.company.toJS();
    let style={
      get color(){ return company.starred ? '#00BCD4' : 'grey'; },
      fontSize: '1.2rem',
    };

    return (
      <a href="#" onClick={this.handleChange}>
        <i style={style} className="iconButton fa fa-star-o m-r"/>
      </a>
    )
  }
}



class AddCompanyButton extends Component {
  componentDidMount(){
    $('#addCompany').tooltip({animation: true});
  }

  handleClick = () => {
    $('#addCompany').tooltip('hide');
    this.props.onAddCompany();
  }

  render(){
    let style = {
        position: 'fixed',
        display: 'block',
        right: 0,
        bottom: 0,
        marginRight: '30px',
        marginBottom: '30px',
        zIndex: '900',
    }

    return (
      <button id="addCompany" type="button" className="btn-primary btn"  data-toggle="tooltip" data-placement="left" title="Add a company" style={style}  onClick={this.handleClick}>
        <i className="fa fa-plus"/>
      </button>
    )
  }
}

class Refresh extends Component {
  handleChange = (e) => {
    this.props.onClick();
    e.preventDefault();
  }

  render(){
    let style={
      fontSize: '1.5rem',
      color: 'grey',
    }

    return (
      <div className="p-a">
        <a href="#" onClick={this.handleChange}>
          <i style={style} className="iconButton fa fa-refresh"/>
        </a>
      </div>
    )
  }
}

class Filter extends Component{
  handleChange = (e) => {
    this.props.onChange(e.target.value);
    e.preventDefault();
  }

  render(){
    let icon= <span className="fa fa-search"/>
    return (
      <div className="p-a">
        <input className="tm input form-control" type='text' value={this.props.filter} placeholder='search ...' onChange={this.handleChange} aria-describedby="filterCompanies"/>
      </div>
    )
  }
}

class Starred extends Component {
  handleChange = (e) => {
    this.props.onClick();
    e.preventDefault();
  }

  render(){
    let filter = this.props.starred;
    let style={
      fontSize: '1.5rem',
      color: filter ? '#00BCD4' : 'grey',
    }

    return (
      <div className="p-a">
        <a href="#" onClick={this.handleChange} > 
          <i style={style} className="iconButton fa fa-star-o"/>
        </a>
      </div>
    )
  }
}

class Sort extends Component {
  handleClick = (mode, e) => {
    this.props.onClick(mode);
    e.preventDefault();
  }

  render(){
    function getSortIcon(sortCond, item){
      if(item.key === sortCond.sortBy){
        let classnames = sortCond.direction === "desc" ? "fa fa-sort-desc p-l" : "fa fa-sort-asc p-l";
        return <i className={classnames}/>
      }
    }
    let style={
      fontSize: '1.5rem',
      color: 'grey',
    }

    let menu = _.map(companies.sortBy, item => {
      return (
        <a key={item.key} className="dropdown-item p-a" href="#" onClick={this.handleClick.bind(null, item.key)}>
          {item.label}
          {getSortIcon(this.props.sortCond, item)}
        </a>
      )
    });

    return (
      <div className="p-a">
        <a href="#" onClick={this.handleChange} id="sort-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> 
          <i style={style} className="iconButton fa fa-sort" onClick={this.handleChange}/>
        </a>
        <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="sort-menu">
          {menu}
        </ul>
      </div>
    )
  }
}
