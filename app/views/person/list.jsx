import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import routes from '../../routes';
import {Content, Header, Actions} from '../layout';
import {PersonPreview, Preferred, Delete, Edit} from '../widgets';
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

  componentDidMount(){
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
    const leftIcon = this.state.persons.isLoading ? <i className="fa fa-spinner fa-spin m-a"/> : <i className="fa fa-users m-a"/>;
    const persons = this.state.persons.data;
    const companies = this.state.persons.companies;
    return (
      <Content>
        <Header leftIcon={leftIcon} title={'People'}>
          <Actions>
            <Filter filter={this.state.persons.filter} onChange={this.handleSearchFilter}/>
            <Sort sortCond={this.state.persons.sort} onClick={this.handleSort}/>
            <FilterPreferred preferred={this.state.persons.filterPreferred} onClick={this.handlePreferred}/>
            <Refresh onClick={this.handleRefresh}/>
          </Actions>
        </Header>
        <List 
          persons={persons} 
          companies={companies} 
          onView={this.handleView} 
          onViewCompany={this.handleViewCompany} 
          onEdit={this.handleEdit} 
          onTogglePreferred={this.handleTogglePreferred} 
          onDelete={this.handleDelete}/>
        <AddButton onAdd ={this.handleAdd}/>
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
            onView={this.props.onView} 
            onViewCompany={this.props.onViewCompany} 
            onTogglePreferred={this.props.onTogglePreferred} 
            onEdit={this.props.onEdit} 
            onDelete={this.props.onDelete}/>
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

class AddButton extends Component {
  componentDidMount(){
    $('#addperson').tooltip({animation: true});
  }

  handleClick = () => {
    $('#addperson').tooltip('hide');
    this.props.onAdd();
  }

  render(){
    const style = {
        position: 'fixed',
        display: 'block',
        right: 0,
        bottom: 0,
        marginRight: '30px',
        marginBottom: '30px',
        zIndex: '900',
    }

    return (
      <button id="addperson" type="button" className="btn-primary btn"  data-toggle="tooltip" data-placement="left" title="Add a contact" style={style}  onClick={this.handleClick}>
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

  const style={
    fontSize: '1.5rem',
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

  const icon= <span className="fa fa-search"/>
  return (
    <div className="p-a">
      <input className="tm input form-control" type='text' value={filter} placeholder='search ...' onChange={handleChange}/>
    </div>
  )
}

const FilterPreferred =({preferred, onClick}) => {
  const handleChange = (e) => {
    onClick();
    e.preventDefault();
  }

  const style={
    fontSize: '1.5rem',
    color: preferred ? '#00BCD4' : 'grey',
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
    if(item.key === sortCond.by){
      const classnames = sortCond.order === "desc" ? "fa fa-sort-desc p-l" : "fa fa-sort-asc p-l";
      return <i className={classnames}/>
    }
  }

  const style={
    fontSize: '1.5rem',
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
