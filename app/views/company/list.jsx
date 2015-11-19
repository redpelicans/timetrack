import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import routes from '../../routes';
import {Content} from '../layout';
import {AvatarView, Edit, Preferred} from '../widgets';
import {AddButton, Sort, FilterPreferred, Filter, Refresh} from '../widgets';
import {Header, HeaderLeft, HeaderRight, Title} from '../widgets';
import {Delete} from './widgets';
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
      companiesActions.delete(company.toJS());
    }
  }

  render(){
    if(!this.state || !this.state.companies) return false;
    const leftIcon = this.state.companies.isLoading ? <i className="fa fa-spinner fa-spin m-r"/> : <i className="fa fa-users m-r"/>;
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
          companies={companies} 
          onView={this.handleView} 
          onEdit={this.handleEdit} 
          onTogglePreferred={this.handleTogglePreferred} 
          onDelete={this.handleDelete}/>

        <AddButton title='Add a company' onAdd ={this.handleAdd}/>

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
          <Company
            company={company} 
            onView={this.props.onView} 
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

class Company extends Component {
  shouldComponentUpdate(nextProps, nextState){
    return this.props.company !== nextProps.company;
  }

  handleView = (e) => {
    this.props.onView(this.props.company);
    e.preventDefault();
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
          <Preferred obj={company} onTogglePreferred={this.props.onTogglePreferred}/>
          <Edit onEdit={this.props.onEdit.bind(null, company)}/>
          <Delete company={company} onDelete={this.props.onDelete}/>
        </div>
      </div>
    );
  }
}


// const Sort =({sortCond, onClick}) => {
//   const handleClick = (mode, e) => {
//     onClick(mode);
//     e.preventDefault();
//   }
//
//   function getSortIcon(sortCond, item){
//     if(item.key === sortCond.by){
//       const classnames = sortCond.order === "desc" ? "fa fa-sort-desc p-l" : "fa fa-sort-asc p-l";
//       return <i className={classnames}/>
//     }
//   }
//
//   const style={
//     fontSize: '1.5rem',
//   }
//
//   const menu = _.map(sortMenu, item => {
//     return (
//       <a key={item.key} className="dropdown-item p-a" href="#" onClick={handleClick.bind(null, item.key)}>
//         {item.label}
//         {getSortIcon(sortCond, item)}
//       </a>
//     )
//   });
//
//   return (
//     <div className="p-a">
//       <a href="#"  id="sort-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> 
//         <i style={style} className="iconButton fa fa-sort" />
//       </a>
//       <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="sort-menu">
//         {menu}
//       </ul>
//     </div>
//   )
// }
