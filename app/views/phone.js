import React, {Component} from 'react';
import classNames from 'classnames';
import {InputField, DropdownField} from './fields';

import Select from 'react-select';

export class PhonesField extends Component{

  componentWillUnmount(){
    this.props.field.state.offValue( this.subscribeFct );
  }

  componentWillMount(){
    this.subscribeFct =  v => {
      this.setState({field: v});
    }
    if(!this.props.field.length) this.props.field.addField();
    this.props.field.state.onValue( this.subscribeFct );
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.field != nextState.field;
  }

  fieldsetClassNames = () => classNames( "form-group");

  handleAdd = (e) => {
    e.preventDefault();
    this.props.field.addField();
  }

  handleDelete = (field, e) => {
    e.preventDefault();
    this.props.field.deleteField(field);
  }


  render(){
    let styles={
      add:{
        fontSize: '1rem',
      }
    }
    const field = this.props.field;
    const phones = _.map(field.getFields(), field => {
      return (
        <div key={field.path} className="col-md-4">
          <Phone field={field} onDeleteField={this.handleDelete} />
        </div>
      )
    })
    return (
      <fieldset className={this.fieldsetClassNames()}>
        <label htmlFor={field.key}> 
          <span>Phones</span> 
          <a href="#" onClick={this.handleAdd} >
            <i style={styles.add} className="iconButton fa fa-plus m-a-1"/>
          </a>
        </label>
        <div className="row">
          {phones}
        </div>
      </fieldset>
    );
  }
}


export class Phone extends Component{
  render(){
    let styles={
      container:{
        display: 'flex',
        flexWrap: 'nowrap',

      },
      number:{
        flexBasis: 'auto',
      },
      number:{
        flexGrow: 1,
      },
      delete:{
        paddingTop: '35px',
        paddingLeft: '10px',
        fontSize: '1rem',
      }
    }

    return (
      <div style={styles.container} className="row">
        <div style={styles.label} className="col-md-4">
          <DropdownField field={this.props.field.field('label')}/>
        </div>
        <div style={styles.number} className="m-l-1">
          <InputField field={this.props.field.field('number')}/>
        </div>
        <div style={styles.delete}>
          <a className="" href="#" onClick={this.props.onDeleteField.bind(null, this.props.field)} >
            <i className="iconButton danger fa fa-minus-circle m-r-1"/>
          </a>
        </div>
      </div>
    )
  }
}
