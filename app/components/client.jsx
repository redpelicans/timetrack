import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import ClientStore from '../stores/client';
import ClientActions from '../actions/client';
import Avatar from './avatar';
//import mui from 'material-ui';
//import IconMenu from 'material-ui/lib/menus/icon-menu';
//import MenuItem from 'material-ui/lib/menus/menu-item';

export default class ClientApp extends Component {

  componentWillMount() {
    ClientActions.fetch();
  }

  render() {
    return (
      <AltContainer stores={ {clientStore: ClientStore} } >
        <ClientPanel/>
      </AltContainer>
    );
  }

}

class ClientPanel extends Component {

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

    let clientRows=[];

    function sortAttr(sortMode){
      if(sortMode.attribute === 'name') return ['name'];
      return [sortMode.attribute, 'name'];
    }

    function sortOrder(sortMode){
      return [sortMode.order, 'asc'];
    }

    function filterStarred(client){
      let starred = this.props.clientStore.starredFilter;
      if(!starred) return true;
      if(starred && client.starred) return true;
    }

    function filterClients(client){
      let filter = this.props.clientStore.filter;
      if(!filter) return true;
      if(filter && client.name && client.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) return true;
    }

    let sortMode = this.props.clientStore.sortMode;
    let filteredClients = _.chain(this.props.clientStore.clients).filter(filterStarred, this).filter(filterClients, this).value();
    for(let client of _.sortByOrder(filteredClients, sortAttr(sortMode), sortOrder(sortMode))){
      clientRows.push( <ClientListItem key={client._id} client={client} onClick={this.handleClientSelection}/>);
    }

    return (
      <div className="mdl-color--white mdl-shadow--2dp mdl-grid" style={styles.layout}>
        <div style={styles.card} className="mdl-cell mdl-cell--12-col">
          <ClientHeader filter={this.props.clientStore.filter} starred={this.props.clientStore.starredFilter} sortMode={this.props.clientStore.sortMode}/>
          <ClientList clients={clientRows} />
        </div>
        <button style={styles.addButton} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
          <i className="material-icons">add</i>
        </button>
      </div>
    );

  }
}

class ClientHeader extends Component {
  close = () => {
    this.context.router.transitionTo("/Home");
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
            <span> Client List</span>
          </div>
          <div style={styles.leftHeader}>
            <div style={styles.search}>
              <ClientListFilter filter={this.props.filter}/>
            </div>
            <div style={styles.starred}>
              <ClientListStarred starred={this.props.starred}/>
            </div>
            <div style={styles.sort}>
              <ClientListSort sortMode={this.props.sortMode}/>
            </div>
            <div style={styles.menu}>
              <ClientListActions/>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

ClientHeader.contextTypes = {
    router: React.PropTypes.func.isRequired
};

class ClientList extends Component {
  render(){
    return (
      <div className="mdl-cell mdl-cell--12-col mdl-grid">
        {this.props.clients}
      </div>
    )
  }
}

class ClientListItem extends Component {
  handleClientSelection = (client) => {
    console.log(`CLIENT SELECTION ${client._id}`)
  }

  handleClientEnter = (e) => {
    e.target.style.background = 'gray';
    e.preventDefault();
  }

  handleClientOut = (e) => {
    e.target.style.background = 'white';
    e.preventDefault();
  }


  render() {

    function phone(client){
      if(!client.phones || !client.phones.length) return '';
      let {label, phone} = client.phones[0];
      return `tel. ${label}: ${phone}`;
    }

    function amount(value){
      if(!value) return;
      return `${Math.round(value/1000)} k€`;
    }


    function billAmount(client, type){
      const name = {billed: 'Billed', billable: 'Billable'};
      if(client[type]){
        return (
          <div style={styles[type]}>
            <span>{name[type]}: {amount(client[type] || 0 )}</span>
          </div>
        )
      }else{
        return <div style={styles[type]}/>
      }
    }

    function billAmounts(client){
      if(client.billed || client.billable){
        return (
          <span>{[amount(client.billed), amount(client.billable)].join(' / ')}</span>
        )
      }
    }


    let styles = {
      client:{
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
      <div style={styles.client} className="mdl-color--white mdl-cell mdl-cell--12-col" onMouseOut={this.handleClientOut} onMouseEnter={this.handleClientEnter} onClick={this.handleClientSelection.bind(null, this.props.client)}>
        <div style={styles.box}>
          <div style={styles.avatar}>
            <Avatar src={this.props.client.avatar}/>
          </div>
          <div style={styles.name}>
            <span>{this.props.client.name}</span>
          </div>
          <div style={styles.billElements}>
            {billAmounts(this.props.client)}
          </div>
          <div style={styles.left}>
            <div style={styles.star}>
              <StarredClient client={this.props.client}/>
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

class StarredClient extends Component{
  handleChange = () => {
    ClientActions.star(this.props.client._id);
  }

  render(){
    let client = this.props.client;
    let style={
      get color(){ return client.starred ? '#00BCD4' : 'grey'; }
    };

    return (
      <button id="clientMenu" className="mdl-button mdl-js-button mdl-button--icon" onClick={this.handleChange}>
        <i style={style} className="material-icons">star_border</i>
      </button>
    )
  }
}

class ClientListSort extends Component {
  handleChange = (value) => {
    ClientActions.sortMainList({attribute: value});
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
      return <li className="mdl-menu__item" onClick={this.handleChange.bind(null, key)}>{sortIcon(key)} {value}</li>
    });


    return(
      <div>
        <button id="clientSortMenu" className="mdl-button mdl-js-button mdl-button--icon" >
          <i className="material-icons">sort_by_alpha</i>
        </button>
        <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-left" htmlFor="clientSortMenu" >
          {menuItems}
        </ul>
      </div>
    )
  }
}

class ClientListStarred extends Component {
  handleChange = () => {
    let starred = this.props.starred ? false : true;
    ClientActions.filterStarredList({starred: starred});
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


class ClientListActions extends Component {
  render(){
    return (
      <div>
        <button id="clientListMenu" className="mdl-button mdl-js-button mdl-button--icon">
          <i className="material-icons">more_vert</i>
        </button>
        <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-left" htmlFor="clientListMenu">
          <li className="mdl-menu__item">Some Action</li>
          <li className="mdl-menu__item">Another Action</li>
          <li disabled className="mdl-menu__item">Disabled Action</li>
          <li className="mdl-menu__item">Yet Another Action</li>
        </ul>
      </div>
    )
  }
}


class ClientListFilter extends Component {
  handleChange = () => {
    ClientActions.filterMainList({ filter: this.refs.filter.getDOMNode().value })
  }

  render() {
    return ( 
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
        <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="searchClient">
          <i className="material-icons">search</i>
        </label>
        <div className="mdl-textfield__expandable-holder">
          <input className="mdl-textfield__input" type="text" id="searchClient" ref="filter" value={this.props.filter} onChange={this.handleChange}/>
          <label className="mdl-textfield__label" htmlFor="searchClient">Enter your query...</label>
        </div>
      </div>
    )
  }
}


