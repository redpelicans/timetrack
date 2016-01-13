import React, {Component} from 'react';
import {Content} from '../layout';
import {Sort, FilterPreferred, Filter, Refresh, Header, HeaderLeft, HeaderRight, Title, TitleIcon} from '../widgets';
import {AddButton, Preferred, Preview, Edit, Delete} from './widgets';
import {personsActions} from '../../models/persons';
import {personsAppStore,  personsAppActions, sortMenu} from '../../models/persons-app';
import routes from '../../routes';

export default class PersonListApp extends Component {

  state = {};

  componentWillMount() {
    const filter = this.props.location.state && this.props.location.state.filter;
    if(filter) personsAppActions.filter(filter);

    this.unsubscribe = personsAppStore.listen( state => {
      this.setState({persons: state});
    });

    personsAppActions.load();
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  handleRefresh = () => {
    personsAppActions.load({forceReload: true});
  }

  handlePreferred = () => {
    personsAppActions.filterPreferred(!this.state.persons.filterPreferred);
  }

  handleSort = (mode) => {
    personsAppActions.sort(mode)
  }

  handleSearchFilter = (filter) => {
    personsAppActions.filter(filter);
  }

  handleResetFilter = (filter) => {
    personsAppActions.filter("");
  }


  // shouldComponentUpdate(nextProps, nextState){
  //   return this.state.people !== nextState.people || 
  //     this.state.searchFilter != nextState.searchFilter || 
  //     this.state.sortCond != nextState.sortCond || 
  //     this.state.starFilter != nextState.starFilter;
  // }

  render(){
    if(!this.state.persons) return false;
    const persons = this.state.persons.data;
    const companies = this.state.persons.companies;
    return (
      <Content>

        <Header>
          <HeaderLeft>
            <TitleIcon isLoading={this.state.persons.isLoading} icon={routes.person.list.iconName}/>
            <Title title='People'/>
          </HeaderLeft>
          <HeaderRight>
            <Filter filter={this.state.persons.filter} onReset={this.handleResetFilter} onChange={this.handleSearchFilter}/>
            <Sort sortMenu={sortMenu} sortCond={this.state.persons.sort} onClick={this.handleSort}/>
            <FilterPreferred preferred={this.state.persons.filterPreferred} onClick={this.handlePreferred}/>
            <Refresh onClick={this.handleRefresh}/>
          </HeaderRight>
        </Header>

        <List 
          persons={persons} 
          companies={companies} />

        <AddButton title='Add a Contact'/>
      </Content>
    )
  }

}


class List extends Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props.persons !== nextProps.persons || this.props.companies !== nextProps.companies;
  }

  render(){
    if(!this.props.persons.size || !this.props.companies.size) return false;

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

    const data = this.props.persons.map(person => {
      return (
        <div key={person.get('_id')} className="col-md-6 tm list-item" style={styles.item}> 
          <Preview
            person={person} 
            company={this.props.companies.get(person.get('companyId'))} >
              <Preferred person={person} active={true}/>
              <Edit person={person}/>
              <Delete person={person}/>
          </Preview>
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

