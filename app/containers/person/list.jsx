import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Content} from '../../components/layout';
import {Sort, FilterPreferred, Filter, Refresh, Header, HeaderLeft, HeaderRight, Title, TitleIcon} from '../../components/person/widgets';
import {AddButton, Preferred, Preview, Edit, Delete} from '../../components/widgets';
import {personsActions} from '../../actions/persons';
import {visiblePersonsSelector} from '../../selectors/persons.js'
import routes from '../../routes';

class PersonListApp extends Component {

  render(){
    return (
      <h1>Hello World</h1>
    )
  }

}


export default connect(visiblePersonsSelector)(PersonListApp);
