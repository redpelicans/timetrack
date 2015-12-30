import React, {Component} from 'react';
//import reactMixin from 'react-mixin';
import {Content} from '../layout';
import {AvatarView, Sort, FilterPreferred, Filter, Refresh} from '../widgets';
import {Header, HeaderLeft, HeaderRight, Title} from '../widgets';
import {Edit, Preferred, Delete, AddButton} from './widgets';
import {companiesAppStore, companiesAppActions, sortMenu} from '../../models/companies-app';
import {companiesActions} from '../../models/companies';
import {navActions} from '../../models/nav';
import authManager from '../../auths';
import routes from '../../routes';

export default class ListApp extends Component {

  state = undefined;

  componentWillMount() {
    this.unsubscribe = companiesAppStore.listen( state => {
      this.setState({companies: state});
    });
    companiesAppActions.load(false);
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  handleRefresh = () => {
    companiesAppActions.load({forceReload: true});
  }

  handlePreferred = () => {
    companiesAppActions.filterPreferred(!this.state.companies.filterPreferred);
  }

  handleTogglePreferred = (company) => {
    companiesActions.togglePreferred(company);
  }

  handleSort = (mode) => {
    companiesAppActions.sort(mode)
  }

  handleSearchFilter = (filter) => {
    companiesAppActions.filter(filter);
  }

  render(){
    if(!this.state || !this.state.companies) return false;
    const leftIcon = this.state.companies.isLoading ? <i className="fa fa-spinner fa-spin m-r-1"/> : <i className="fa fa-users m-r-1"/>;
    const companies = this.state.companies.data;
    return (
      <Content>

        <Header>
          <HeaderLeft>
            {leftIcon}
            <Title title='Companies'/>
          </HeaderLeft>
          <HeaderRight>
            <Filter filter={this.state.companies.filter} onChange={this.handleSearchFilter}/>
            <Sort sortMenu={sortMenu} sortCond={this.state.companies.sort} onClick={this.handleSort}/>
            <FilterPreferred preferred={this.state.companies.filterPreferred} onClick={this.handlePreferred}/>
            <Refresh onClick={this.handleRefresh}/>
          </HeaderRight>
        </Header>

        <List 
          isLoading={this.state.companies.isLoading} 
          companies={companies}  />

        <AddButton title='Add a company'/>

      </Content>
    )
  }

}


class List extends Component {
  render(){
    if(!this.props.companies) return false;
    const styles={
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

    const data = this.props.companies.map(company => {
      return (
        <div key={company.get('_id')} className="col-md-6 tm list-item" style={styles.item}> 
          <Preview company={company} />
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

class Preview extends Component {
  shouldComponentUpdate(nextProps, nextState){
    return this.props.company !== nextProps.company;
  }

  handleView = (e) => {
    e.preventDefault();
    navActions.push(routes.company.view, {companyId: this.props.company.get('_id')});
  }

  render() {

    console.log("render Company")

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

    const styles = {
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

    const company = this.props.company;
    const avatar = <AvatarView obj={company}/>;
    const isNew = company.get('isNew') ? <span className="label label-success">new</span> : <div/>
    const avatarView = () => {
      if(authManager.company.isAuthorized('view')) return  <a href="#" onClick={this.handleView}>{avatar}</a>;
      else return {avatar}
    }
    const companyNameView = () => {
      if(authManager.company.isAuthorized('view')) return  <a href="#" onClick={this.handleView}>{company.get('name')}</a>;
      else return <span>{company.get('name')}</span>
    }

    return (
      <div style={styles.container} >
        <div style={styles.containerLeft}>
          <div className="p-r-1">
            {avatarView()}
          </div>
          <div className="p-r-1">
            {companyNameView()}
          </div>
          <div className="p-r-1">
            {billAmounts(company)}
          </div>
          <div className="p-r-1">
            {isNew}
          </div>
        </div>
        <div style={styles.containerRight} href="#">
          <Preferred company={company} active={true}/>
          <Edit company={company}/>
          <Delete company={company}/>
        </div>
      </div>
    );
  }
}

