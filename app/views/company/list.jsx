import React, {Component} from 'react';
import {Content} from '../layout';
import {AvatarView, Sort, FilterPreferred, Filter, Refresh, NewLabel, UpdatedLabel} from '../widgets';
import {Header, HeaderLeft, HeaderRight, Title, TitleIcon} from '../widgets';
import {Edit, Preferred, Delete, AddButton, Preview} from './widgets';
import {companiesAppStore, companiesAppActions, sortMenu} from '../../models/companies-app';
import {companiesActions} from '../../models/companies';
import {navActions} from '../../models/nav';
import authManager from '../../auths';
import routes from '../../routes';

export default class ListApp extends Component {

  state = undefined;

  componentWillMount() {
    const filter = this.props.location.state && this.props.location.state.filter;
    if(filter) companiesAppActions.filter(filter);

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

  handleResetFilter = (filter) => {
    companiesAppActions.filter("");
  }

  render(){
    if(!this.state || !this.state.companies) return false;
    const companies = this.state.companies.data;
    return (
      <Content>

        <Header>
          <HeaderLeft>
            <TitleIcon isLoading={this.state.companies.isLoading} icon={routes.company.list.iconName}/>
            <Title title='Companies'/>
          </HeaderLeft>
          <HeaderRight>
            <Filter filter={this.state.companies.filter} onReset={this.handleResetFilter} onChange={this.handleSearchFilter}/>
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


