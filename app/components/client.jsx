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

    console.log("ClientList rendering ...");
    for(let client of this.props.clientStore.clients){
      console.log(client);
      rows.push(<Client key={client.id} label={client.name} />);
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );

  }
}

class Client extends Component {
  render() {
    return (
        <tr> 
          <td>
             {this.props.label}
          </td>
        </tr>
    );
  }
}
