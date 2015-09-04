import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import ClientStore from '../stores/client';
import ClientActions from '../actions/client';

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
    let rows=[];
    for(let client of this.props.clientStore.clients){
      rows.push(<ClientRow key={client.id} client={client} />);
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Web Site</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
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
        <tr> 
          <td>
             {this.props.client.name}
          </td>
          <td>
             {phone(this.props.client)}
          </td>
          <td>
             {this.props.client.website}
          </td>
        </tr>
    );
  }
}
