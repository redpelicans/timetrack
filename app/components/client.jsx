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
        <ClientCard/>
      </AltContainer>
    );
  }

}

class ClientCard extends Component {

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

    function filterClients(client){
      let filter = this.props.clientStore.filter;
      if(!filter)return true;
      if(filter && client.name && client.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) return true;
    }

    let sortMode = this.props.clientStore.sortMode;
    for(let client of _.sortByOrder(this.props.clientStore.clients.filter(filterClients.bind(this)), sortAttr(sortMode), sortOrder(sortMode))){
      clientRows.push( <ClientListItem key={client._id} client={client} />);
    }

    return (
      <div className="mdl-color--white mdl-shadow--2dp mdl-grid" style={styles.layout}>
        <div style={styles.card} className="mdl-cell mdl-cell--12-col mdl-grid">
          <ClientBar/>
        </div>
        <div style={styles.card} className="mdl-cell mdl-cell--12-col mdl-grid">
          {clientRows}
        </div>
        <button style={styles.addButton} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
          <i className="material-icons">add</i>
        </button>
      </div>
    );

  }
}

class ClientBar extends Component {
  render(){
    return(
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">Client List</span>
          </div>
        </header>
      </div>
    )
  }
}

class ClientListItem extends Component {
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

    function billElements(client){
      if(client.billed || client.billable){
        return [
          <div className="pure-g" style={styles.bill}>
            <div className="pure-u-1-3"></div>
            <div key={1} className="pure-u-1-3"><span>Billed: {amount(client.billed || 0 )}</span></div>
            <div key={2} className="pure-u-1-3"><span>Billable:  {amount(client.billable || 0 )}</span></div>
          </div>
        ]
      }
      return [
          <div>
          </div>
        ]
    }

    let styles = {
      client:{
        // position: 'relative',
        // top: '50%',
        // transform: 'translateY(-50%)',
        //-webkit-transform: 'translateY(-50%)',
        //-ms-transform: 'translateY(-50%)'
      },
      middle:{
        verticalAlign: 'middle'
      },
      bill: {
        marginTop: '2%',
        marginBottom: '2%',
      }
    };
 
    return (
      <div style={styles.client} className="mdl-color--white mdl-cell mdl-cell--12-col mdl-grid">
        <Avatar src={this.props.client.avatar}/>
        <span style={styles.middle}>{this.props.client.name}</span>
      </div>
    );
  }
}
class ClientSortMenu extends Component {
  handleChange = (e, value) => {
    ClientActions.sortMainList({attribute: value});
  }

  render(){
    return(
      <div>
      </div>
    )
  }
}

// class ClientList extends Component {
//   render(){
//     return (
//       <div>
//       </div>
//     )
//   }
// }

class ClientFilter extends Component {
  handleChange = () => {
    ClientActions.filterMainList({ filter: this.refs.filter.getValue() })
  }

  render() {
    return ( 
      <div>
      </div>
    )
  }
}


