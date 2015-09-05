import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import ClientStore from '../stores/client';
import ClientActions from '../actions/client';
import mui from 'material-ui';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

export class TimesheetApp extends Component {

  componentWillMount() {
    ClientActions.fetch();
  }

  render() {
    return (
      <AltContainer 
        stores={ {clientStore: ClientStore} }
        //actions={ClientActions}
      >
        <ClientCard/>
      </AltContainer>
    );
  }

}

class ClientCard extends Component {

  state = { filter: '', sort: 'billable'};

  handleFilterHasChanged = (data) => {
    this.setState(data);
  }

  handlefilteredClients = (data) => {
    this.setState(data);
  }

  handleSort = (e, value) =>{
    this.setState({sort: value});
  }

  render() {
    let styles = {
      card: {
        marginTop: '2%',
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


    let menuIconButton = <mui.IconButton iconClassName="material-icons" tooltipPosition="bottom-center" >more_vert</mui.IconButton>
    return (
      <div className="pure-g" style={styles.card}>
        <div className="pure-u-1-5"/>
        <div className="pure-u-3-5">
          <mui.Card zDepth={3}>
            <mui.Toolbar>
              <mui.ToolbarGroup key={0} float="left">
                <ClientFilter filter={this.state.filter} filterHasChanged={this.handleFilterHasChanged}/>
              </mui.ToolbarGroup>
              <mui.ToolbarGroup key={2} float="right">
                <ClientSortMenu sort={this.state.sort} handleSort={this.handleSort} />
                <IconMenu iconButtonElement={menuIconButton}>
                  <MenuItem index={1} primaryText="Add" />
                  <MenuItem index={2} primaryText="Reload" />
                </IconMenu>
              </mui.ToolbarGroup>
            </mui.Toolbar>
            <mui.CardMedia 
              overlay={ <mui.CardTitle title="Client List" subtitle={`(TODO/${this.props.clientStore.clients.length}) clients`}/>} >
               <img src="/images/business2.png"/>
            </mui.CardMedia>
            <ClientList filter={this.state.filter}  sort={this.state.sort} clients={this.props.clientStore.clients}/>
          </mui.Card>
        </div>
        <div className="pure-u-1-5">
          <mui.FloatingActionButton style={styles.addButton} iconClassName="material-icons">add</mui.FloatingActionButton>
        </div>
      </div>
    );

  }
}

class ClientSortMenu extends Component {
  render(){
    let sortIconButton = <mui.IconButton iconClassName="material-icons" tooltipPosition="bottom-center" >sort_by_alpha</mui.IconButton>
    let menu = {
      name: "Sort by Name",
      billed: "Sort by Billed",
      billable: "Sort by Billable",
      creationDate: "Sort by Creation Date"
    }
    let menuItems = _.map(menu, (value, key) => {
      return <MenuItem index={key} checked={this.props.sort === key} value={key} primaryText={value} />
    });
    return (
      <IconMenu onChange={this.props.handleSort} iconButtonElement={sortIconButton}>
        {menuItems}
      </IconMenu>
    )
  }
}

class ClientList extends Component {
  render(){
    let rows=[];

    function sortClients(a,b){
      let attr = this.props.sort;
      if( (a[attr] || 0) > (b[attr] || 0)) return -1;
      else if( (a[attr] || 0) < (b[attr] || 0)) return 1;
      else return a.name > b.name ? 1 : -1;
    }

    function filterClients(client){
      if(!this.props.filter)return true;
      if(this.props.filter && client.name && client.name.toLowerCase().indexOf(this.props.filter.toLowerCase()) !== -1) return true;
    }

    for(let client of this.props.clients.filter(filterClients.bind(this)).sort(sortClients.bind(this))){
      rows.push(
        <div key={client._id}>
          <ClientListItem client={client} />
          <mui.ListDivider inset={true} />
        </div>
      );
    }

    return (
      <mui.List> 
        {rows}
      </mui.List> 
    )
  }
}

class ClientFilter extends Component {
  handleChange = () => {
    this.props.filterHasChanged({
      filter: this.refs.filter.getValue()
    })
  }

  render() {
    return ( 
      <mui.TextField ref="filter" value={this.props.filter} onChange={this.handleChange} hintText="Hint To Select Clients" />
    )
  }
}

class ClientListItem extends Component {
  render() {
    //let iconButtonElement = <mui.IconButton iconClassName="muidocs-icon-custom-github" tooltip="GitHub"/>
    let iconButtonElement = <mui.IconButton iconClassName="material-icons" tooltipPosition="bottom-center" >settings</mui.IconButton>
    let rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem index={1} primaryText="Show" />
        <MenuItem index={2} primaryText="Edit" />
        <MenuItem index={3} primaryText="Delete" />
      </IconMenu>
    );

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
          <div className="pure-g" style={styles.bill}>
            <div className="pure-u-1"></div>
          </div>
        ]
    }

    let styles = {
      bill: {
        marginTop: '2%',
        marginBottom: '2%',
      }
    };
 
    return (
      <mui.ListItem
        leftAvatar={<mui.Avatar src={this.props.client.avatar}/>}
        rightIconButton={rightIconMenu}
        primaryText={
          <div>
            <div className="pure-g"> 
              <div className="pure-u-1-3">{this.props.client.name}</div>
            </div>
            {billElements(this.props.client)}
            <div className="pure-g"> 
              <div className="pure-u-1">
                {this.props.client.note}
              </div>
            </div>
          </div>
        }

        secondaryText={
          <p>
            <span style={{color: mui.Styles.Colors.darkBlack}}>{phone(this.props.client)}</span><br/>
          </p>
        }
        secondaryTextLines={2}
       /> 

    );
  }
}
