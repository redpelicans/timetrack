import {ComboboxField} from '../fields';
import {countriesStore, countriesActions} from '../../models/countries';
import _ from 'lodash';

export default class Country extends ComboboxField{
  componentWillUnmount(){
    super.componentWillUnmount();
    this.unsubscribeCountries();
  }

  componentWillMount(){
    this.subscribeFct =  v => this.setState({field: v});
    this.props.field.state.onValue( this.subscribeFct );

    this.unsubscribeCountries = countriesStore.listen( countries => {
      this.setState({domainValue: _.map(countries.data.toJS(), country => {return {key: country, value: country}})});
    })
    countriesActions.load();
  }
}
