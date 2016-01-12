import React, {Component} from 'react';
import Multiselect from 'react-widgets/lib/Multiselect';
import {BaseSelectField, MultiSelectField2} from '../fields';
import {tagsStore, tagsActions} from '../../models/tags';
import _ from 'lodash';


// const TagItem = ({item}) => {
//   return(
//     <span>
//       <strong>
//         <div className="m-r-1">{item.value}</div>
//       </strong>
//     </span>
//   )
// }

export default class TagField extends BaseSelectField{
  state = {}

  componentWillUnmount(){
    super.componentWillUnmount();
    this.unsubscribeTags();
  }

  handleChange = (values) => {
    this.props.field.setValue( _.map(values, v => v.key) );
  }

  onCreate = (name) => {
    const tag = {key: name, value: name};
    const domainValue = this.state.domainValue;
    domainValue.push(tag);
    const value = this.state.field.get('value') && this.state.field.get('value').toJS() || [];
    this.props.field.setValue( value.concat(name) );
    this.setState({domainValue});
  }

  componentWillMount(){
    this.subscribeFct =  v => {
      this.setState({field: v});
    };
    this.props.field.state.onValue( this.subscribeFct );

    this.unsubscribeTags = tagsStore.listen( tags => {
      const domainValue = _.map(tags.data.toJS(), tag => {return {key: tag, value: tag}});
      this.setState({domainValue});
    })
    tagsActions.load();
  }

  render(){
    if(!this.state.field) return false;
    let field = this.props.field;

    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.value === this.state.field.get("value"));
      return <TextLabel label={field.label} value={keyValue && keyValue.label}/>
    }else{
      const props = {
        placeholder: field.label,
        valueField: 'key',
        textField: 'value',
        data: this.state.domainValue,  
        value: this.state.field.get('value') && this.state.field.get('value').toJS() || [], 
        id: field.key, 
        caseSensitive: false,
        onChange: this.handleChange,
        onCreate: this.onCreate
      };
      const multiselect = React.createElement( Multiselect, props );

      return(
        <fieldset className={this.fieldsetClassNames()}>
          <label htmlFor={field.key}>{field.label}</label>
          {multiselect}
          <small className="text-muted control-label">{this.message()}</small>
        </fieldset>
      )
    }
  }

}
