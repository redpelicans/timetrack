import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import routes from '../../routes';
import {Content, Header, Actions} from '../layout';
import {AvatarView} from '../widgets';
import classNames from 'classnames';
import {companiesAppStore, companiesAppActions, sortMenu} from '../../models/companies-app';
import {companiesStore, companiesActions} from '../../models/companies';

//@reactMixin.decorate(Reflux.connect(companies.store, "companiesStore"))
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
    companiesAppActions.load(true);
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

  handleAdd = () => {
    this.props.history.pushState(null, routes.newcompany.path);
  }

  handleEdit = (company) => {
    this.props.history.pushState({id: company.get('_id')}, routes.editcompany.path);
  }

  handleView = (company) => {
    this.props.history.pushState({id: company.get('_id')}, routes.viewcompany.path);
  }

  handleDelete = (company) => {
    const answer = confirm(`Are you sure to delete the contact "${company.get('name')}"`);
    if(answer){
      companiesActions.delete(company);
    }
  }

  render(){
    if(!this.state || !this.state.companies) return false;
    const leftIcon = this.state.companies.isLoading ? <i className="fa fa-spinner fa-spin m-a"/> : <i className="fa fa-users m-a"/>;
    const companies = this.state.companies.data;
    return (
      <Content>
        <Header leftIcon={leftIcon} title={'Companies'}>
          <Actions>
            <Filter filter={this.state.companies.filter} onChange={this.handleSearchFilter}/>
            <Sort sortCond={this.state.companies.sort} onClick={this.handleSort}/>
            <FilterPreferred starred={this.state.companies.filterPreferred} onClick={this.handlePreferred}/>
            <Refresh onClick={this.handleRefresh}/>
          </Actions>
        </Header>
        <List 
          isLoading={this.state.companies.isLoading} 
          companies={companies} 
          onView={this.handleView} 
          onEdit={this.handleEdit} 
          onTogglePreferred={this.handleTogglePreferred} 
          onDelete={this.handleDelete}/>
        <AddButton onAdd ={this.handleAdd}/>
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
          <ListItem company={company} onView={this.props.onView} onTogglePreferred={this.props.onTogglePreferred} onEdit={this.props.onEdit} onDelete={this.props.onDelete}/>
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
    return this.props.company !== nextProps.company;
  }

  handleView = (e) => {
    this.props.onView(this.props.company);
    e.preventDefault();
  }

  render() {

    console.log("render CompanyItem")

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
    const avatar = <AvatarView obj={company.toJS()}/>;
    const isNew = company.get('isNew') ? <span className="label label-success">new</span> : <div/>
    return (
      <div style={styles.container} >
        <div style={styles.containerLeft}>
          <div className="p-r">
            <a href="#" onClick={this.handleView}>{avatar}</a>
          </div>
          <div className="p-r">
            <a href="#" onClick={this.handleView}>{company.get('name')}</a>
          </div>
          <div className="p-r">
            {billAmounts(company)}
          </div>
          <div className="p-r">
            {isNew}
          </div>
        </div>
        <div style={styles.containerRight} href="#">
          <Starred company={company} onTogglePreferred={this.props.onTogglePreferred}/>
          <Edit company={company} onEdit={this.props.onEdit}/>
          <Delete company={company} onDelete={this.props.onDelete}/>
        </div>
      </div>
    );
  }
}

const Edit = ({company, onEdit}) => {
  const handleChange = (e) => {
    onEdit(company);
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

const Delete =({company, onDelete}) => {
  const handleChange = (e) => {
    onDelete(company);
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

const Starred = ({company, onTogglePreferred}) => {
  const handleChange = (e) => {
    onTogglePreferred(company);
    e.preventDefault();
  }

  const style={
    color: company.get('preferred') ? '#00BCD4' : 'grey',
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
    $('#addcompany').tooltip({animation: true});
  }

  handleClick = () => {
    $('#addcompany').tooltip('hide');
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
      <button id="addcompany" type="button" className="btn-primary btn"  data-toggle="tooltip" data-placement="left" title="Add a contact" style={style}  onClick={this.handleClick}>
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
