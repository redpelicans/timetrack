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
        <ClientList/>
      </AltContainer>
    );
  }

}

class ClientList extends Component {

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

    let sortMenuItems = [
       { payload: '1', text: 'Name' },
       { payload: '2', text: 'Billed' },
       { payload: '3', text: 'Billable' }
    ];

    let sortIconButton = <mui.IconButton iconClassName="material-icons" tooltipPosition="bottom-center" >sort_by_alpha</mui.IconButton>
    let menuIconButton = <mui.IconButton iconClassName="material-icons" tooltipPosition="bottom-center" >more_vert</mui.IconButton>
    let rows=[];

    for(let client of this.props.clientStore.clients){
      rows.push(
        <div key={client._id}>
          <ClientListItem client={client} />
          <mui.ListDivider inset={true} />
        </div>
      );
    }
    return (
      <div className="pure-g" style={styles.card}>
        <div className="pure-u-1-5"/>
        <div className="pure-u-3-5">
          <mui.Card zDepth={3}>
            <mui.Toolbar>
              <mui.ToolbarGroup key={0} float="left">
                <mui.TextField hintText="Hint To Select Clients" />
              </mui.ToolbarGroup>
              <mui.ToolbarGroup key={1} float="right">
                <IconMenu iconButtonElement={sortIconButton}>
                  <MenuItem index={1} primaryText="Sort by Name" />
                  <MenuItem index={2} primaryText="Sort by Billed" />
                  <MenuItem index={3} primaryText="Sort by Billable" />
                  <MenuItem index={4} primaryText="Sort by Creation Date" />
                </IconMenu>
                <IconMenu iconButtonElement={menuIconButton}>
                  <MenuItem index={1} primaryText="Add" />
                  <MenuItem index={2} primaryText="Reload" />
                </IconMenu>
              </mui.ToolbarGroup>
            </mui.Toolbar>
            <mui.CardMedia 
              overlay={ <mui.CardTitle title="Client List" subtitle={`(${this.props.clientStore.clients.length}) clients`}/>} >
               <img src="/images/business2.png"/>
            </mui.CardMedia>
            <mui.List> 
              {rows}
            </mui.List> 
          </mui.Card>
        </div>
        <div className="pure-u-1-5">
          <mui.FloatingActionButton style={styles.addButton} iconClassName="material-icons">add</mui.FloatingActionButton>
        </div>
      </div>
    );

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
            <div className="pure-g" style={styles.bill}> 
              <div className="pure-u-1-3"></div>
              <div className="pure-u-1-3"><span>Billed: 45 k€</span></div>
              <div className="pure-u-1-3"><span>Billable: 345 k€</span></div>
            </div>
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
