import {ComboboxField} from '../fields';
import {citiesStore, citiesActions} from '../../models/cities';
import _ from 'lodash';

export default class City extends ComboboxField{
  componentWillUnmount(){
    super.componentWillUnmount();
    this.unsubscribeCities();
  }

  componentWillMount(){
    this.subscribeFct =  v => this.setState({field: v});
    this.props.field.state.onValue( this.subscribeFct );

    this.unsubscribeCities = citiesStore.listen( cities => {
      this.setState({domainValue: _.map(cities.data.toJS(), city => {return {key: city, value: city}})});
    })
    citiesActions.load();
  }
}
