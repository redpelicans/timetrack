import _ from 'lodash';
import {ComboboxField} from '../components/fields';
import {countriesActions} from '../actions/countries';
import {countriesSelector} from '../selectors/countries';
import {authable} from '../components/authmanager';
import { connect } from 'react-redux';
import {PropTypes} from 'react';

export default class Country extends ComboboxField{

  componentWillMount(){
    this.subscribeFct =  v => this.setState({field: v});
    this.props.field.state.onValue( this.subscribeFct );
    this.props.dispatch(countriesActions.load());
  }

  componentWillReceiveProps(nextProps){
    const {countries} = nextProps;
    this.setState({domainValue: countries});
  }

}

Country.propTypes = {
  dispatch:   PropTypes.func.isRequired,
  countries:  PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default connect(countriesSelector)(Country);
