import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import ClientStore from '../stores/client';
import ClientActions from '../actions/client';
import mui from 'material-ui';

export class ClientApp extends Component {

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
    return (
      <ClientTable clientStore={this.props.clientStore}/>
    )
  }
}

class ClientTable extends Component {

  onCellClick = () => {
    windows.alert('Coucou');
  }

  render() {
    let rows=[];
    for(let client of this.props.clientStore.clients){
      rows.push(<ClientRow key={client._id} client={client} />);
    }
    return (
      <mui.Table
        height='500px'
        fixedHeader={false}
        fixedFooter={false}
        selectable={true}
        multiSelectable={false}
        onCellClick={this.CellClick}>
        <mui.TableHeader 
          enableSelectAll={false}
          adjustForCheckbox={false}
          displaySelectAll={false}>
          <mui.TableRow>
            <mui.TableHeaderColumn>Name</mui.TableHeaderColumn>
            <mui.TableHeaderColumn>Phone</mui.TableHeaderColumn>
            <mui.TableHeaderColumn>Web Site</mui.TableHeaderColumn>
          </mui.TableRow>
        </mui.TableHeader>
        <mui.TableBody
          deselectOnClickaway={true}
          showRowHover={true}
          selectable={true}
          stripedRows={true}> 
          {rows}
        </mui.TableBody>
      </mui.Table>
    );

  }
}

class ClientRow extends Component {
  render() {
    function phone(client){
      if(!client.phones || !client.phones.length) return '';
      let {label, phone} = client.phones[0];
      return `${label}: ${phone}`;
    }

    return (
        <mui.TableRow hoverable={true}> 
          <mui.TableRowColumn>
             <mui.Avatar src={this.props.client.avatar}/> 
             {this.props.client.name}
          </mui.TableRowColumn>
          <mui.TableRowColumn>
             {phone(this.props.client)}
          </mui.TableRowColumn>
          <mui.TableRowColumn>
             {this.props.client.website}
          </mui.TableRowColumn>
        </mui.TableRow>
    );
  }
}
