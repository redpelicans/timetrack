import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import routes from '../../routes';
import {Content} from '../layout';
import {AddButton, PersonPreview, Preferred, Delete, Edit, Sort, FilterPreferred, Filter, Refresh} from '../widgets';
import {Header, HeaderLeft, HeaderRight, Title} from '../widgets';
import classNames from 'classnames';
import {personsStore,  personsActions} from '../../models/persons';
import {personsAppStore,  personsAppActions, sortMenu} from '../../models/persons-app';

//@reactMixin.decorate(Reflux.connect(persons.store, "peopleStore"))
export default class ListApp extends Component {

  state = {};

  componentWillMount() {
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

  handleAdd = () => {
    this.props.history.pushState(null, routes.newperson.path);
  }

  handleTogglePreferred = (person) => {
    personsActions.togglePreferred(person);
  }

  handleEdit = (person) => {
    this.props.history.pushState({id: person.get('_id')}, routes.editperson.path);
  }

  handleView = (person) => {
    this.props.history.pushState({id: person.get('_id')}, routes.viewperson.path);
  }

  handleDelete = (person) => {
    const answer = confirm(`Are you sure to delete the contact "${person.get('name')}"`);
    if(answer){
      personsActions.delete(person.toJS());
    }
  }

  handleViewCompany = (company) => {
    this.props.history.pushState({id: company.get('_id')}, routes.viewcompany.path);
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   return this.state.people !== nextState.people || 
  //     this.state.searchFilter != nextState.searchFilter || 
  //     this.state.sortCond != nextState.sortCond || 
  //     this.state.starFilter != nextState.starFilter;
  // }

  render(){
    if(!this.state.persons) return false;
    const leftIcon = this.state.persons.isLoading ? <i className="fa fa-spinner fa-spin m-r"/> : <i className="fa fa-users m-r"/>;
    const persons = this.state.persons.data;
    const companies = this.state.persons.companies;
    return (
      <Content>

        <Header>
          <HeaderLeft>
            {leftIcon}
            <Title title='People'/>
          </HeaderLeft>
          <HeaderRight>
            <Filter filter={this.state.persons.filter} onChange={this.handleSearchFilter}/>
            <Sort sortMenu={sortMenu} sortCond={this.state.persons.sort} onClick={this.handleSort}/>
            <FilterPreferred preferred={this.state.persons.filterPreferred} onClick={this.handlePreferred}/>
            <Refresh onClick={this.handleRefresh}/>
          </HeaderRight>
        </Header>

        <List 
          persons={persons} 
          companies={companies} 
          onView={this.handleView} 
          onViewCompany={this.handleViewCompany} 
          onEdit={this.handleEdit} 
          onTogglePreferred={this.handleTogglePreferred} 
          onDelete={this.handleDelete}/>

        <AddButton title='Add a Contact' onAdd={this.handleAdd}/>
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
          <PersonPreview
            person={person} 
            company={this.props.companies.get(person.get('companyId'))} 
            onViewCompany={this.props.onViewCompany} 
            onViewPerson={this.props.onView}>
              <Preferred obj={person} onTogglePreferred={this.props.onTogglePreferred}/>
              <Edit onEdit={this.props.onEdit.bind(null, person)}/>
              <Delete onDelete={this.props.onDelete.bind(null, person)}/>
          </PersonPreview>
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

