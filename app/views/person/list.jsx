import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import routes from '../../routes';
import {Content, Header, Actions} from '../layout';
import {AvatarView} from '../widgets';
import classNames from 'classnames';
import {personsStore as peopleStore, personsActions as peopleActions, sortMenu} from '../../models/persons';

//@reactMixin.decorate(Reflux.connect(persons.store, "peopleStore"))
export default class ListApp extends Component {

  state = undefined;

  componentWillMount() {
    peopleActions.load();
  }

  componentDidMount(){
    this.unsubscribe = peopleStore.listen( state => {
      this.setState(state);
    });
  }

  componentWillUnount(){
    this.unsubscribe();
  }

  handleRefresh = () => {
    peopleActions.load();
  }

  handlePreferred = () => {
    peopleActions.filterPreferred(!this.state.filterPreferred);
  }

  handleTogglePreferred = (person) => {
    peopleActions.togglePreferred(person);
  }

  handleSort = (mode) => {
    peopleActions.sort(mode)
  }

  handleSearchFilter = (filter) => {
    peopleActions.filter(filter);
  }

  handleAdd = () => {
    this.props.history.pushState(null, routes.newperson.path);
  }

  handleEdit = (person) => {
    this.props.history.pushState({id: person._id}, routes.editperson.path);
  }

  handleView = (person) => {
    this.props.history.pushState({id: person._id}, routes.viewperson.path);
  }

  handleDelete = (person) => {
    const answer = confirm(`Are you sure to delete the contact "${person.name}"`);
    if(answer){
      person.delete(person).then( () => {
        persons.load();
      });
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   return this.state.people !== nextState.people || 
  //     this.state.searchFilter != nextState.searchFilter || 
  //     this.state.sortCond != nextState.sortCond || 
  //     this.state.starFilter != nextState.starFilter;
  // }

  render(){
    if(!this.state) return false;
    const leftIcon = this.state.isLoading ? <i className="fa fa-spinner fa-spin m-a"/> : <i className="fa fa-users m-a"/>;
    const persons = this.state.persons;
    return (
      <Content>
        <Header leftIcon={leftIcon} title={'People'}>
          <Actions>
            <Filter filter={this.state.searchFilter} onChange={this.handleSearchFilter}/>
            <Sort sortCond={this.state.sort} onClick={this.handleSort}/>
            <FilterPreferred starred={this.state.filterPreferred} onClick={this.handlePreferred}/>
            <Refresh onClick={this.handleRefresh}/>
          </Actions>
        </Header>
        <List isLoading={this.state.isLoading} persons={persons} onView={this.handleView} onEdit={this.handleEdit} onTogglePreferred={this.handleTogglePreferred} onDelete={this.handleDelete}/>
        <AddButton onAdd ={this.handleAdd}/>
      </Content>
    )
  }

}


class List extends Component {

  // shouldComponentUpdate(nextProps, nextState){
  //   return this.props.model.people !== nextProps.model.people;
  // }

  render(){
    if(!this.props.persons) return false;
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
          <ListItem person={person} onView={this.props.onView} onTogglePreferred={this.props.onTogglePreferred} onEdit={this.props.onEdit} onDelete={this.props.onDelete}/>
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

class ListItem extends Component {
  shouldComponentUpdate(nextProps, nextState){
    return this.props.person !== nextProps.person;
  }

  handleView = (e) => {
    this.props.onView(this.props.person);
    e.preventDefault();
  }

  render() {
    console.log("render PersonItem")
    function phone(person){
      if(!person.phones || !person.phones.length) return '';
      const {label, phone} = person.phones[0];
      return `tel. ${label}: ${phone}`;
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

    const person = this.props.person;
    const avatar = <AvatarView obj={person.toJS()}/>;
    const isNew = person.get('isNew') ? <span className="label label-success">new</span> : <div/>
    return (
      <div style={styles.container} >
        <div style={styles.containerLeft}>
          <div className="p-r">
            <a href="#" onClick={this.handleView}>{avatar}</a>
          </div>
          <div className="p-r">
            <a href="#" onClick={this.handleView}>{person.get('name')}</a>
          </div>
          <div className="p-r">
            {isNew}
          </div>
        </div>
        <div style={styles.containerRight} href="#">
          <Starred person={person} onTogglePreferred={this.props.onTogglePreferred}/>
          <Edit person={person} onEdit={this.props.onEdit}/>
          <Delete person={person} onDelete={this.props.onDelete}/>
        </div>
      </div>
    );
  }
}

const Edit = ({person, onEdit}) => {
  const handleChange = (e) => {
    onEdit(person);
    e.preventDefault();
  }

  const style={
    fontSize: '1.2rem',
    color: 'grey',
  };

  return (
    <a href="#" onClick={handleChange}>
      <i style={style} className="iconButton fa fa-pencil m-r"/>
    </a>
  )
}

const Delete =({person, onDelete}) => {
  const handleChange = (e) => {
    onDelete(person);
    e.preventDefault();
  }

  const style={
    fontSize: '1.2rem',
    color: 'grey',
  };

  return (
    <a href="#" onClick={handleChange}>
      <i style={style} className="iconButton fa fa-trash m-r"/>
    </a>
  )
}

const Starred = ({person, onTogglePreferred}) => {
  const handleChange = (e) => {
    onTogglePreferred(person);
    e.preventDefault();
  }

  const style={
    color: person.get('preferred') ? '#00BCD4' : 'grey',
    fontSize: '1.2rem',
  };

  return (
    <a href="#" onClick={handleChange}>
      <i style={style} className="iconButton fa fa-star-o m-r"/>
    </a>
  )
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

  const icon= <span className="fa fa-search"/>
  return (
    <div className="p-a">
      <input className="tm input form-control" type='text' value={filter} placeholder='search ...' onChange={handleChange}/>
    </div>
  )
}

const FilterPreferred =({starred, onClick}) => {
  const handleChange = (e) => {
    onClick();
    e.preventDefault();
  }

  const style={
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
    if(item.key === sortCond.by){
      const classnames = sortCond.order === "desc" ? "fa fa-sort-desc p-l" : "fa fa-sort-asc p-l";
      return <i className={classnames}/>
    }
  }

  const style={
    fontSize: '1.5rem',
    color: 'grey',
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
