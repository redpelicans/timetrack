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
  type: {
    label: "Type",
    type: "string",
    values: {
      client: 'Client', 
      partner: 'Partner',
      tenant: 'Tenant', 
    },
    defaultValue: 'client',
    required: true,
  },
  website: {
    label: "Website",
    type: "string",
  },
  mainCompany: {
    label: "Main Company",
    type: "string",
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
      label: "VAT",
      type: 'number',
      unit: '%'
    },
    timeBillable:{
      minimum:{
        label: "Minimum Time Billable",
        type: 'number',
      },
      unit:{
        label: "Billable Unit",
        values: ['Day', 'Hour'],
        defaultValue: 'Day'
      }
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

let formoField = addCompanySchema.field.bind(addCompanySchema);

class CompanyAddForm extends Component {

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
              <div className="twelve wide column">
                <InputFormElement field={formoField('name')}/>
              </div>
              <div className="four wide column">
                <SelectFormElement field={formoField('type')}/>
              </div>
            </div>
          </div>
        </div>

      </div>
      )
  }
}

class InputFormElement extends Component {
  constructor(props){
    super(props);
    this.props.field.bind(this);
  }

  state = {
    error: false, 
    value: this.props.field.defaultValue || ""
  }

  handleChange = () => {
    let value = this.refs[this.props.field.key].getDOMNode().value;
    this.setState({ 
      value: value,
      error: this.props.field.checkValue(value)
    })
  }

  fieldValue(){
    let {error, value} = this.state;
    if(error)throw new Error(this.props.field.errorMessage(value));
    this.setState({ error: this.props.field.checkValue(value) })
    if(this.state.error) throw new Error(error);
    return value;
  }

  fieldClassName = () => {
    let klasses = ['field'];
    if(this.props.field.isRequired()) klasses.push('required');
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
        <label>{this.props.field.label}</label>
        <input ref={this.props.field.key} type="text" value={this.state.value} placeholder={this.props.field.label} onChange={this.handleChange}/>
        <div style={styles.errorMessage} className="ui pointing red basic label">
          {this.state.error}
        </div>
      </div>
    )
  }
}

class SelectFormElement extends Component {
  constructor(props){
    super(props);
    this.props.field.bind(this);
  }

  state = {
    error: false, 
    value: this.props.field.defaultValue || ""
  }

  componentDidMount(){
    $('.dropdown.selectFormElement').dropdown({
      onChange: (value) => {
        this.setState({
          value: value,
          error: this.props.field.checkValue(value)
        })
      }
    });
  }

  fieldValue(){
    let {error, value} = this.state;
    if(error)throw new Error(this.props.field.errorMessage(value));
    this.setState({ error: this.props.field.checkValue(value) })
    if(this.state.error) throw new Error(error);
    return value;
  }

  fieldClassName = () => {
    let klasses = ['field'];
    if(this.props.field.isRequired()) klasses.push('required');
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
    let menuItems = _.map(this.props.field.schema.values, (value, key) => {
      return (
        <div className="item" key={key} data-value={key}>{value}</div>
      )
    });

    return(
      <div className={this.fieldClassName()}>
        <label>{this.props.field.label}</label>
        <div className="ui selection dropdown selectFormElement">
          <input type="hidden" name={this.props.field.key} value={this.state.value} />
          <i className="dropdown icon"></i>
          <div className="default text">{this.props.field.label}</div>
          <div className="menu">
            {menuItems}
          </div>
        </div>
        <div style={styles.errorMessage} className="ui pointing red basic label">
          {this.state.error}
        </div>
      </div>
    )
  }
}


class CompanyAddHeader extends Component {

  componentDidMount(){
    // TODO: doesn't work
    //this.refs.addActions.getDOMNode().dropdown();
    $('.dropdown.addActions').dropdown({
      onChange: (text, value) => {
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
            <div className="ui dropdown addActions" ref="addActions">
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

