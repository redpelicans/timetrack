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
  address: {
    street1 :{ 
      label: 'Street1',
      type: 'string'
    },
    street2 :{ 
      label: 'Street2',
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
      defaultValue: 'France',
      required: true
    },
  },
  billing:{
    creditPeriod:{
      label: "Credit Period",
      type: "integer",
      unit: "Days",
      defaultValue: 30,
    },
    invoicingContacts:{
      label: "Invoicing Contacts",
      type: 'string',
    },
    vatNumber:{
      label: "VAT Number",
      type: 'string',
    },
    vatPct:{
      label: "VAT Value (%)",
      type: 'number',
    },
    minTimeBillable:{
      label: "Minimum Time Billable",
      type: 'number',
    },
    billableUnit:{
      label: "Billable Unit",
      values: ['Day', 'Hour'],
      defaultValue: 'Day'
    },
    setupPerDay:{
      hours:{
        label: 'Hours/Day',
        type: 'integer'
      },
      allowOverrun:{
        label: 'Allow Overrun',
        type: 'boolean'
      },
      disableSubmit:{
        label: 'Disable Submit If Lower',
        type: 'boolean'
      }
    },
    setupPerWeek:{
      includeWeekEnd:{
        label: 'Include Week End',
        type: 'boolean'
      },
    },
    reminder:{
      label: "Frequency to Send Reminder to Fill Timesheet",
      type: "integer",
      unit: 'Day'
    }
  }
});


class CompanyAddForm extends Component {

  componentDidMount(){
    $('.dropdown').dropdown();
  }

  getData(){
    return addCompanySchema.getData();
  }

  render(){
    let styles={
      header:{
        marginTop: '40px',
        marginBottom: '30px',
      },
      icon:{
        color: '#00BCD4',
        fontSize: '2em',
      }
    }

    return (

      <div className="ui form">
        <h5 style={styles.header} className="ui center aligned icon header">
           <i style={styles.icon} className="info circle icon"/>
           General
        </h5>
        <div className="ui centered grid">
          <div className="ten wide computer fourteen wide tablet column">
            <div className="ui stackable centered grid">
              <div className="sixteen wide column">
                <InputFormElement attr='name'/>
              </div>
              <div className="height wide column">
                <InputFormElement attr='address.street1'/>
              </div>
              <div className="height wide column">
                <InputFormElement attr='address.street2'/>
              </div>
              <div className="five wide column">
                <InputFormElement attr='address.zip'/>
              </div>
              <div className="six wide column">
                <InputFormElement attr='address.city'/>
              </div>
              <div className="five wide column">
                <CountryFormElement attr='address.country'/>
              </div>
            </div>
          </div>
        </div>
        <h5  style={styles.header} className="ui center aligned icon header">
           <i style={styles.icon} className="pie chart icon"/>
           Billing
        </h5>
        <div className="ui centered grid">
          <div className="ten wide computer fourteen wide tablet column">
            <div className="ui stackable centered grid">
              <div className="sixteen wide column">
                <InputUnitFormElement attr='billing.creditPeriod'/>
              </div>
              <div className="sixteen wide column">
                <InputFormElement attr='billing.invoicingContacts'/>
              </div>
              <div className="height wide column">
                <InputFormElement attr='billing.vatNumber'/>
              </div>
              <div className="height wide column">
                <InputFormElement attr='billing.vatPct'/>
              </div>
              <div className="sixteen wide column">
                <div className="field">
                  <label>Minimum Time Billable</label>
                  <div className="ui right labeled input">
                    <input type="text" placeholder="Minimum Time Billable"/>
                    <div className="ui dropdown label">
                      <div className="text">days</div>
                      <i className="dropdown icon"></i>
                        <div className="menu">
                          <div className="item">days</div>
                          <div className="item">hours</div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

@formo.input(addCompanySchema)
class InputFormElement extends Component {

  handleChange = () => {
    let value = this.refs[this.attrKey].getDOMNode().value;
    this.setState({ 
      value: value,
      error: this.checkValue(value)
    })
  }

  fieldClassName = () => {
    let klasses = ['field'];
    if(this.isRequired()) klasses.push('required');
    if(this.state.error) klasses.push('error');
    return klasses.join(' ');
  }

  render(){
    let element = this;
    let styles={
      errorMessage:{
        get display(){return element.state.error ? '' : 'none'},
      }
    }

    return(
      <div className={this.fieldClassName()}>
        <label>{this.label}</label>
        <input type="text" value={this.state.value} placeholder={this.label} ref={this.attrKey} onChange={this.handleChange}/>
        <div style={styles.errorMessage} className="ui pointing red basic label">
          {this.state.error}
        </div>
      </div>
    )
  }
}


@formo.input(addCompanySchema)
class InputUnitFormElement extends Component {

  handleChange = () => {
    let value = this.refs[this.attrKey].getDOMNode().value;
    this.setState({ 
      value: value,
      error: this.checkValue(value)
    })
  }

  fieldClassName = () => {
    let klasses = ['field'];
    if(this.isRequired()) klasses.push('required');
    if(this.state.error) klasses.push('error');
    return klasses.join(' ');
  }

  render(){
    let element = this;
    let styles={
      errorMessage:{
        get display(){return element.state.error ? '' : 'none'},
      }
    }

    return(
      <div className={this.fieldClassName()}>
        <label>{this.label}</label>
        <div className="ui right labeled input">
          <input type="text" value={this.state.value} placeholder={this.label} ref={this.attrKey} onChange={this.handleChange}/>
          <div className="ui label">
            {this.attrDef.unit}
          </div>
        </div>
        <div style={styles.errorMessage} className="ui pointing red basic label">
          {this.state.error}
        </div>
      </div>
    )
  }
}



@formo.input(addCompanySchema)
class CountryFormElement extends Component {

  handleChange = (value) => {
    this.setState({ value: value });
  }

  fieldClassName = () => {
    let klasses = ['field'];
    if(this.isRequired()) klasses.push('required');
    return klasses.join(' ');
  }

  render(){
    return(
      <div className={this.fieldClassName()}>
        <label>{this.label}</label>
        <Country handleChange={this.handleChange}/>
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
    let styles={
      icon:{
        marginRight: '.5em',
      }
    }
    return(
      <div className="ui centered grid">
        <div className="three column row">
          <div className="two wide column">
            <button className="ui basic button" onClick={this.props.handleValidate}> 
              <i className="material-icons">keyboard_backspace</i>
            </button>
          </div>
          <div className="centered aligned twelve wide column">
            <h3 className="ui header">
              <i style={styles.icon} className="material-icons">business</i>
              <div className="content"> Companies</div>
              <div className="sub header">Add a company</div>
            </h3>
          </div>
          <div className="right aligned two wide column">
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

