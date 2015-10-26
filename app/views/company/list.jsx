import _ from 'lodash';
import React, {Component} from 'react';
import routes from '../../routes';
import {Content, Header, Actions} from '../layout';
import Avatar from '../avatar';
//import Header from '../header';
//import MainButtonMenu from '../main_button_menu';
import companies from '../../models/companies';

export default class CompanyListApp extends Component {

  static contextTypes = {
  }

  state = { 
    companies: []
  };

  componentDidMount() {
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

  handleSearchFilter = (filter) => {
    companies.searchFilter(filter);
  }

  handleAddCompany = () => {
    this.props.history.pushState(null, routes.newcompany.path);
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.companies !== nextState.companies || 
      this.state.searchFilter != nextState.searchFilter || 
      this.state.starFilter != nextState.starFilter;
  }

  render(){
    let leftIcon = <i className="fa fa-building m-a"/>;
    return (
      <Content>
        <Header leftIcon={leftIcon} title={'Companies'}>
          <Actions>
            <Filter filter={this.state.searchFilter} onChange={this.handleSearchFilter}/>
            <Starred starred={this.state.starFilter} onClick={this.handleStarred}/>
            <Refresh onClick={this.handleRefresh}/>
          </Actions>
        </Header>
        <CompanyList model={this.state}/>
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
          <CompanyListItem company={company}/>
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
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: '15px',
      },
      avatar:{
        order: 1,
        cursor: 'pointer',
      },
      billElements:{
        order: 3,
        flex: '1 1 auto'
      },
      star:{
        order: 1,
      },
      edit:{
        order: 2,
        color: '#757575',
      },
      name:{
        marginLeft: '20px',
        marginRight: '20px',
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontWeight: '500',
        order: 2,
        flex: '1 1 auto',
        cursor: 'pointer',
      },
      left:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        order: 4,
        alignSelf: 'flex-start',
        //flex: '1 1 50%',
      },

    };

    let company = this.props.company.toJS();
    let avatar = company.avatar ? <Avatar src={company.avatar}/> : <Avatar name={company.name}/>;
    return (
        <div href="#" style={styles.container} XclassName='tm list-item'>
          <div style={styles.avatar} onClick={this.handleCompanySelection}>
            {avatar}
          </div>
          <div style={styles.name} onClick={this.handleCompanySelection}>
            <span>{company.name}</span>
          </div>
          <div style={styles.billElements}>
            {billAmounts(company)}
          </div>
          <div className="pull-right" style={styles.left}>
            <div style={styles.star}>
            <StarredCompany company={this.props.company}/>
            </div>
            <div style={styles.edit}>
              <EditCompany company={this.props.company}/>
            </div>
          </div>
        </div>
    );
  }
}

class EditCompany extends Component{
  handleChange = (e) => {
    console.log("Company EDIT");
    //companies.edit(this.props.company.toJS());
    e.preventDefault();
  }

  render(){
    let style={
      fontSize: '1.2rem',
      color: 'grey',
    };

    return (
      <a href="#" onClick={this.handleChange}>
        <i style={style} className="fa fa-pencil m-r"/>
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
        <i style={style} className="fa fa-star-o m-r"/>
      </a>
    )
  }
}



class AddCompanyButton extends Component {
  componentDidMount(){
    $('#addCompany').tooltip({animation: true});
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
      <button id="addCompany" type="button" className="btn-primary btn tm button"  data-toggle="tooltip" data-placement="left" title="Add a company" style={style}  onClick={this.props.onAddCompany}>
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
          <i style={style} className="fa fa-refresh"/>
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
      get color(){ return filter ? '#00BCD4' : 'grey'; }
    }

    return (
      <div className="p-a">
        <a href="#" onClick={this.handleChange} > 
          <i style={style} className="fa fa-star-o"/>
        </a>
      </div>
    )
  }
}
