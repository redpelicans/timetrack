import _ from 'lodash';
import React, {Component} from 'react';
import Avatar from '../avatar';
import Header from '../header';
import {Button, Input, Glyphicon} from 'react-bootstrap';
import MainButtonMenu from '../main_button_menu';
import companies from '../../models/companies';

export default class CompanyListApp extends Component {

  static contextTypes = {
    toggleSideBar: React.PropTypes.func.isRequired,
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
    this.props.history.pushState(null, "/AddCompany");
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.companies !== nextState.companies || 
      this.state.searchFilter != nextState.searchFilter || 
      this.state.starFilter != nextState.starFilter;
  }

  render(){
    let buttonMenu = (
      <MainButtonMenu onClick={this.context.toggleSideBar}/>
    )

    return (
      <div>
        <Header title={'Companies'} buttonMenu={buttonMenu}>
          <Actions>
            <Filter filter={this.state.searchFilter} onChange={this.handleSearchFilter}/>
            <Starred starred={this.state.starFilter} onClick={this.handleStarred}/>
            <Refresh onClick={this.handleRefresh}/>
          </Actions>
        </Header>
        <div className="content">
          <AddCompanyButton onAddCompany={this.handleAddCompany}/>
          <CompanyList model={this.state}/>
        </div>
      </div>
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
        width: '80%',
        marginTop: '50px',
        marginBottom: '50px',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    }

    let companies = this.props.model.companies;
    let data = companies.map( company => {
      return <CompanyListItem key={company.get('_id')} company={company}/>
    });

    return (
      <div style={styles.container}>
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
    //console.log(`CLIENT SELECTION ${company._id}`)
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
          <span>{[amount(company.billed), amount(company.billable)].join(' / ')}</span>
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
        boxShadow: '0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)',
      },
      avatar:{
        order: 1,
      },
      billElements:{
        order: 3,
        flex: '1 0 auto'
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
        flex: '1 0 50%'
      },
      left:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        order: 4,
        alignSelf: 'flex-start',
        flex: '1 1 100%',
      },

    };

    let company = this.props.company.toJS();
    return (
        <div style={styles.container} className='navigation2-link'>
          <div style={styles.avatar}>
            <Avatar src={company.avatar}/>
          </div>
          <div style={styles.name}>
            <span>{company.name}</span>
          </div>
          <div style={styles.billElements}>
            {billAmounts(company)}
          </div>
          <div style={styles.left}>
            <div style={styles.star}>
              <StarredCompany company={this.props.company}/>
            </div>
            <div style={styles.edit}>
              <div>
                <i className="material-icons">edit</i>
              </div>
            </div>
          </div>

        </div>
    );
  }
}


class StarredCompany extends Component{
  handleChange = () => {
    companies.toggleStar(this.props.company.toJS());
  }

  render(){
    let company = this.props.company.toJS();
    let style={
      get color(){ return company.starred ? '#00BCD4' : 'grey'; }
    };

    return (
      <a href="#" onClick={this.handleChange}>
        <i style={style} className="material-icons">star_border</i>
      </a>
    )
  }
}



class AddCompanyButton extends Component {
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
      <Button bsSize="large" bsStyle="primary" style={style}  onClick={this.props.onAddCompany}>
        <Glyphicon glyph="plus"/>
      </Button>
    )
  }
}

class Actions extends Component {
  render(){
    let styles={
      actions:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        fontSize: 'x-large',
        marginRight: '50px',
      },
    }
    return (
      <div style={styles.actions}>
        {this.props.children}
      </div>
    )
  }
}

class Refresh extends Component {
  render(){
    return (
      <div>
        <a href="#" onClick={this.props.onClick} > <i className="material-icons">refresh</i> </a>
      </div>
    )
  }
}

class Filter extends Component{

  handleChange = (e) => {
    this.props.onChange(e.target.value);
  }

  render(){
    //let icon=<i className="material-icons">search</i>;
    let icon=<Glyphicon glyph="search"/>;
    return (
      <div>
        <Input type='text' value={this.props.filter} placeholder='search' onChange={this.handleChange} addonAfterXX={icon}/>
      </div>
    )
  }
}

class Starred extends Component {
  render(){
    let filter = this.props.starred;
    let style={
      get color(){ return filter ? '#00BCD4' : 'grey'; }
    }

    return (
      <div>
        <a href="#" onClick={this.props.onClick} > 
          <i style={style} className="material-icons">star_border</i> 
        </a>
      </div>
    )
  }
}
