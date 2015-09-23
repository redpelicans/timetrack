import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import CompanyStore from './store';
import CompanyActions from './actions';
import Country from '../country';
import * as formo from '../../formo';


export default class CompanyAddApp extends Component {

  componentWillMount() {
  }

  render() {
    return (
      <AltContainer stores={ {companyStore: CompanyStore} } >
        <CompanyAddPanel/>
      </AltContainer>
    );
  }

}

class CompanyAddPanel extends Component {

  componentDidMount() {
    componentHandler.upgradeDom();
  }

  handleValidate = () => {
    let addForm = this.refs.form;
    let data = addForm.getData();
    console.log(data)
    //this.context.router.transitionTo("/Companies");
  }

  render() {
    return (
      <div className="ui raised segment container" >
        <CompanyAddHeader handleValidate={this.handleValidate}/>
        <CompanyAddForm ref='form'/>
      </div>
    );

  }
}

CompanyAddPanel.contextTypes = {
    router: React.PropTypes.func.isRequired
};

let addCompanySchema = new formo.Schema('/Company', {
  name: {
    label: "Name",
    type: "string",
    required: true,
  },
  age: {
    label: "Age",
    type: "integer",
    defaultValue: 42,
    pattern: "^[0-9]{1,2}$"
  },
  address: {
    street :{ 
      label: 'Street',
      type: 'string'
    },
    zip :{ 
      label: 'zip',
      type: 'string'
    },
    city :{ 
      label: 'city',
      type: 'string'
    },
    country :{ 
      label: 'Country',
      type: 'string',
      values:[ 'France', 'USA' ],
      //defaultValue: 'france',
      required: true
    },
  },
});


class CompanyAddForm extends Component {
  getData(){
    return addCompanySchema.getData();
  }

  render(){
    return (
      <div className="ui centered grid">
        <div className="height wide column">
          <div className="ui form">
            <h4 className="ui horizontal divider header">
               <i className="tag icon"></i>
               General
            </h4>
            <InputFormElement attr='name'/>
            <InputFormElement attr='age'/>
            <div className="field">
             <Country attr='address.country'/>
           </div>
          </div>
        </div>
      </div>
    )
  }
}

@formo.input(addCompanySchema)
class InputFormElement extends Component {

  handleChange2 = () => {
    console.log("COUCOU");
  }

  fieldClassName = () => {
    return this.isRequired() ? 'required field' : 'field';
  }

  render(){
    return(
      <div className={this.fieldClassName()}>
        <label>{this.label}</label>
        <input type="text" pattern={this.pattern} required={this.isRequired() ? "required" : "none"} placeholder={this.label} ref={this.attrKey} onChange={this.handleChange2}/>
      </div>
    )
  }
}


class CompanyAddHeader extends Component {

  componentDidMount(){
    // TODO: doesn't work
    //this.refs.addActions.getDOMNode().dropdown();
    $('.dropdown').dropdown({
      action: (text, value) => {
        console.log('Cancel inputs ...');
      }
    });
  }

  render(){
    return(
      <div className="ui grid">
        <div className="three column row">
          <div className="two wide column">
            <button className="ui button" onClick={this.props.handleValidate}> 
              <i className="material-icons">keyboard_backspace</i>
            </button>
          </div>
          <div className="left floated column">
            <h3 className="ui header">
              <i className="material-icons">business</i>
              <div className="content"> Companies</div>
              <div className="sub header">Add a company</div>
            </h3>
          </div>
          <div className="right floated one wide column">
            <div className="ui dropdown" ref="addActions">
              <i className="material-icons">more_vert</i>
              <div className="menu">
                <div className="item" data-value="cancel"> Reset inputs </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

