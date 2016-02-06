import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {tagsSelector} from '../selectors/tags';
import {tagsActions} from '../actions/tags';

import Multiselect from 'react-widgets/lib/Multiselect';
import {BaseSelectField, MultiSelectField2} from '../components/fields';

const TagItem = ({item}) => {
  const styles={
    label:{
      backgroundColor: '#0275d8',
      marginRight: '1rem',
    }
  }

  const handleClick = (e) => {
    e.preventDefault();
    onClick(item.value);
  }

  // if(onClick){
  //   return (
  //     <a href="#" onClick={handleClick}>
  //       <span style={styles.label}>{item.value}</span>
  //     </a>
  //   )
  // }else{
  //   return <span style={styles.label}>{item.value}</span>;
  // }
  
  return <span style={styles.label}>{item.value}</span>;
}

class TagField extends BaseSelectField{
  state = {}

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
    this.setState({domainValue: this.props.tags});
    this.subscribeFct =  v => this.setState({field: v}); 
    this.props.field.state.onValue( this.subscribeFct );
    this.props.dispatch(tagsActions.load());
  }

  componentWillReceiveProps(nextProps){
    this.setState({domainValue: nextProps.tags});
  }

  render(){
    if(!this.state.field) return false;
    const {field} = this.props;

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
        tagComponent: TagItem,
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

TagField.propTypes = {
  tags: PropTypes.array,
  field: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect(tagsSelector)(TagField);
