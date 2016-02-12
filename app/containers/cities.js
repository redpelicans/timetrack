import _ from 'lodash';
import {ComboboxField} from '../components/fields';
import {citiesActions} from '../actions/cities';
import {citiesSelector} from '../selectors/cities';
import {authable} from '../components/authmanager';
import { connect } from 'react-redux';
import {PropTypes} from 'react';

@authable
export default class City extends ComboboxField{
  componentWillMount(){
    this.subscribeFct =  v => this.setState({field: v});
    this.props.field.state.onValue( this.subscribeFct );
    this.props.dispatch(citiesActions.load());
  }

  componentWillReceiveProps(nextProps){
    const {cities} = nextProps;
    this.setState({domainValue: cities});
  }
}

City.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cities:   PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default connect(citiesSelector)(City);
