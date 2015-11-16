import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import routes from '../../routes';
import {Content, Header, Actions} from '../layout';
import {AvatarView} from '../widgets';
import classNames from 'classnames';
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

  handleViewCompany = (company) => {
    this.props.history.pushState({id: company._id}, routes.viewcompany.path);
  }

  handleDeleteCompany = (company) => {
    let answer = confirm(`Are you sure to delete the company "${company.name}"`);
    if(answer){
      companies.delete(company).then( () => {
        companies.load();
      });
    }
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
        <CompanyList model={this.state} onView={this.handleViewCompany} onEdit={this.handleEditCompany} onDelete={this.handleDeleteCompany}/>
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
          <CompanyListItem company={company} onView={this.props.onView} onEdit={this.props.onEdit} onDelete={this.props.onDelete}/>
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

  handleViewCompany = (e) => {
    this.props.onView(this.props.company.toJS());
    e.preventDefault();
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
    let avatar = <AvatarView company={company}/>;
    let isNew = company.isNew ? <span className="label label-success">new</span> : <div/>
    return (
      <div style={styles.container} >
        <div style={styles.containerLeft}>
          <div className="p-r">
            <a href="#" onClick={this.handleViewCompany}>{avatar}</a>
          </div>
          <div className="p-r">
            <a href="#" onClick={this.handleViewCompany}>{company.name}</a>
          </div>
          <div className="p-r">
            {billAmounts(company)}
          </div>
          <div className="p-r">
            {isNew}
          </div>
        </div>
        <div style={styles.containerRight} href="#">
          <StarredCompany company={this.props.company.toJS()}/>
          <EditCompany company={this.props.company.toJS()} onEdit={this.props.onEdit}/>
          <DeleteCompany company={this.props.company.toJS()} onDelete={this.props.onDelete}/>
        </div>
      </div>
    );
  }
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

const StarredCompany = ({company}) => {
  const handleChange = (e) => {
    companies.toggleStar(company);
    e.preventDefault();
  }

  let style={
    get color(){ return company.starred ? '#00BCD4' : 'grey'; },
    fontSize: '1.2rem',
  };

  return (
    <a href="#" onClick={handleChange}>
      <i style={style} className="iconButton fa fa-star-o m-r"/>
    </a>
  )
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

const Refresh =({onClick}) => {
  const handleChange = (e) => {
    onClick();
    e.preventDefault();
  }

  let style={
    fontSize: '1.5rem',
    color: 'grey',
  }

  return (
    <div className="p-a">
      <a href="#" onClick={handleChange}>
        <i style={style} className="iconButton fa fa-refresh"/>
      </a>
    </div>
  )
}

const Filter =({filter, onChange}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
    e.preventDefault();
  }

  let icon= <span className="fa fa-search"/>
  return (
    <div className="p-a">
      <input className="tm input form-control" type='text' value={filter} placeholder='search ...' onChange={handleChange} aria-describedby="filterCompanies"/>
    </div>
  )
}

const Starred =({starred, onClick}) => {
  const handleChange = (e) => {
    onClick();
    e.preventDefault();
  }

  let style={
    fontSize: '1.5rem',
    color: starred ? '#00BCD4' : 'grey',
  }

  return (
    <div className="p-a">
      <a href="#" onClick={handleChange} > 
        <i style={style} className="iconButton fa fa-star-o"/>
      </a>
    </div>
  )
}

const Sort =({sortCond, onClick}) => {
  const handleClick = (mode, e) => {
    onClick(mode);
    e.preventDefault();
  }

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
      <a key={item.key} className="dropdown-item p-a" href="#" onClick={handleClick.bind(null, item.key)}>
        {item.label}
        {getSortIcon(sortCond, item)}
      </a>
    )
  });

  return (
    <div className="p-a">
      <a href="#"  id="sort-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> 
        <i style={style} className="iconButton fa fa-sort" />
      </a>
      <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="sort-menu">
        {menu}
      </ul>
    </div>
  )
}
