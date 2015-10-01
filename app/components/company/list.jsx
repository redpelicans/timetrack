import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import CompanyStore from './store';
import CompanyActions from './actions';
import Avatar from '../avatar/app';
//import mui from 'material-ui';
//import IconMenu from 'material-ui/lib/menus/icon-menu';
//import MenuItem from 'material-ui/lib/menus/menu-item';

export default class CompanyListApp extends Component {

  componentWillMount() {
    CompanyActions.fetch();
  }

  render() {
    return (
      <AltContainer stores={ {companyStore: CompanyStore} } >
        <CompanyPanel history={this.props.history}/>
      </AltContainer>
    );
  }
}

class CompanyPanel extends Component {
  handleAddCompany = () => {
    //this.context.history.pushState(null, "/AddCompany");
    this.props.history.pushState(null, "/AddCompany");
  }

  componentDidMount() {
    componentHandler.upgradeDom();
  }

  render() {
    let styles = {
      layout:{
        maxWidth: '1080px'
      },
      card:{
        alignItems: 'center',
      },
      addButton:{
        position: 'fixed',
        display: 'block',
        right: 0,
        bottom: 0,
        marginRight: '40px',
        marginBottom: '40px',
        zIndex: '900'
      }
    };

    let companyRows=[];

    function sortAttr(sortMode){
      if(sortMode.attribute === 'name') return ['name'];
      return [sortMode.attribute, 'name'];
    }

    function sortOrder(sortMode){
      return [sortMode.order, 'asc'];
    }

    function filterStarred(company){
      let starred = this.props.companyStore.starredFilter;
      if(!starred) return true;
      if(starred && company.starred) return true;
    }

    function filterCompanies(company){
      let filter = this.props.companyStore.filter;
      if(!filter) return true;
      if(filter && company.name && company.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) return true;
    }

    let sortMode = this.props.companyStore.sortMode;
    let filteredCompanies = _.chain(this.props.companyStore.companies).filter(filterStarred, this).filter(filterCompanies, this).value();
    for(let company of _.sortByOrder(filteredCompanies, sortAttr(sortMode), sortOrder(sortMode))){
      companyRows.push( <CompanyListItem key={company._id} company={company} onClick={this.handleCompanySelection}/>);
    }

    return (
      <div className="mdl-color--white mdl-shadow--2dp mdl-grid" style={styles.layout}>
        <div style={styles.card} className="mdl-cell mdl-cell--12-col">
          <CompanyHeader history={this.props.history} filter={this.props.companyStore.filter} starred={this.props.companyStore.starredFilter} sortMode={this.props.companyStore.sortMode}/>
          <CompanyList companies={companyRows} />
        </div>
        <button style={styles.addButton} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" onClick={this.handleAddCompany}>
          <i className="material-icons">add</i>
        </button>
      </div>
    );

  }
}

//
// CompanyPanel.contextTypes = {
//     history: React.PropTypes.history
// };


class CompanyHeader extends Component {
  close = () => {
    //this.context.history.pushState(null, "/");
    this.props.history.pushState(null, "/");
  }

  render(){
    let styles={
      header:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: '#757575 !important',
        height: '64px',
      },
      title: {
        marginLeft: '20px',
        fontFamily: 'Roboto',
        fontSize: '20px',
        letterSpacing: '.02em',
        color: '#757575 !important',
        fontWeight: 400,
        lineHeight: '32px',
        order:1,
        flex: '1 1 auto'
      },
      leftHeader:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        order: 3,
      },
      search:{
        order: 1,
      },
      starred:{
        order:2,
      },
      sort:{
        order:3,
      },
      menu:{
        order:4,
      },
      close:{
        order: 0,
        marginLeft: '12px',
        marginRight: '12px',
        //flex: '0 1 3%',
      }
    }

    return(
    <div className="mdl-grid">
      <div className="mdl-cell mdl-cell--12-col">
        <div style={styles.header}>
          <div style={styles.close}>
            <button onClick={this.close} className="mdl-button mdl-js-button mdl-button--icon">
              <i className="material-icons">close</i>
            </button>
          </div>
          <div style={styles.title}>
            <span> Company List</span>
          </div>
          <div style={styles.leftHeader}>
            <div style={styles.search}>
              <CompanyListFilter filter={this.props.filter}/>
            </div>
            <div style={styles.starred}>
              <CompanyListStarred starred={this.props.starred}/>
            </div>
            <div style={styles.sort}>
              <CompanyListSort sortMode={this.props.sortMode}/>
            </div>
            <div style={styles.menu}>
              <CompanyListActions/>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

// CompanyHeader.contextTypes = {
//     history: React.PropTypes.history
// };

class CompanyList extends Component {
  render(){
    return (
      <div className="Xmdl-cell Xmdl-cell--12-col Xmdl-grid">
        {this.props.companies}
      </div>
    )
  }
}

class CompanyListItem extends Component {
  handleCompanySelection = (company) => {
    //console.log(`CLIENT SELECTION ${company._id}`)
  }

  handleCompanyEnter = (e) => {
    // e.target.style.background = 'gray';
    // e.preventDefault();
  }

  handleCompanyOut = (e) => {
    // e.target.style.background = 'white';
    // e.preventDefault();
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
      company:{
      },
      box:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
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
        flex: '1 1 100%'
      },

    };
 
    return (
      <div style={styles.company} className="mdl-color--white mdl-cell mdl-cell--12-col" onMouseOut={this.handleCompanyOut} onMouseEnter={this.handleCompanyEnter} onClick={this.handleCompanySelection.bind(null, this.props.company)}>
        <div style={styles.box}>
          <div style={styles.avatar}>
            <Avatar src={this.props.company.avatar}/>
          </div>
          <div style={styles.name}>
            <span>{this.props.company.name}</span>
          </div>
          <div style={styles.billElements}>
            {billAmounts(this.props.company)}
          </div>
          <div style={styles.left}>
            <div style={styles.star}>
              <StarredCompany company={this.props.company}/>
            </div>
            <div style={styles.edit}>
              <button className="mdl-button mdl-js-button mdl-button--icon">
                <i className="material-icons">edit</i>
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

class StarredCompany extends Component{
  handleChange = () => {
    CompanyActions.star(this.props.company._id);
  }

  render(){
    let company = this.props.company;
    let style={
      get color(){ return company.starred ? '#00BCD4' : 'grey'; }
    };

    return (
      <button id="companyMenu" className="mdl-button mdl-js-button mdl-button--icon" onClick={this.handleChange}>
        <i style={style} className="material-icons">star_border</i>
      </button>
    )
  }
}

class CompanyListSort extends Component {
  handleChange = (value) => {
    CompanyActions.sortMainList({attribute: value});
  }

  render(){
    let menu = {
      name: "Sort by Name",
      billed: "Sort by Billed",
      billable: "Sort by Billable",
    }

    let {attribute, order} = this.props.sortMode;

    let sortIcon = (key) => {
      if(attribute === key)return <i className="material-icons"> {order === 'desc' ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}</i>;
    }

    let menuItems = _.map(menu, (value, key) => {
      return <li key={key} className="mdl-menu__item" onClick={this.handleChange.bind(null, key)}>{sortIcon(key)} {value}</li>
    });


    return(
      <div>
        <button id="companySortMenu" className="mdl-button mdl-js-button mdl-button--icon" >
          <i className="material-icons">sort_by_alpha</i>
        </button>
        <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-left" htmlFor="companySortMenu" >
          {menuItems}
        </ul>
      </div>
    )
  }
}

class CompanyListStarred extends Component {
  handleChange = () => {
    let starred = this.props.starred ? false : true;
    CompanyActions.filterStarredList({starred: starred});
  }

  render(){
    let starred = this.props.starred;
    let style={
      get color(){ return starred ? '#00BCD4' : 'grey'; }
    };
    return(
      <div>
        <button className="mdl-button mdl-js-button mdl-button--icon" onClick={this.handleChange}>
          <i style={style} className="material-icons">star_border</i>
        </button>
      </div>
    )
  }
}


class CompanyListActions extends Component {
  render(){
    return (
      <div>
        <button id="companyListMenu" className="mdl-button mdl-js-button mdl-button--icon">
          <i className="material-icons">more_vert</i>
        </button>
        <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-left" htmlFor="companyListMenu">
          <li className="mdl-menu__item">Some Action</li>
          <li className="mdl-menu__item">Another Action</li>
          <li disabled className="mdl-menu__item">Disabled Action</li>
          <li className="mdl-menu__item">Yet Another Action</li>
        </ul>
      </div>
    )
  }
}


class CompanyListFilter extends Component {
  handleChange = () => {
    CompanyActions.filterMainList({ filter: this.refs.filter.value })
  }

  render() {
    return ( 
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
        <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="searchCompany">
          <i className="material-icons">search</i>
        </label>
        <div className="mdl-textfield__expandable-holder">
          <input className="mdl-textfield__input" type="text" id="searchCompany" ref="filter" value={this.props.filter} onChange={this.handleChange}/>
          <label className="mdl-textfield__label" htmlFor="searchCompany">Enter your query...</label>
        </div>
      </div>
    )
  }
}


