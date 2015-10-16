import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import AddCompanyStore from './store';
import AddCompanyActions from './actions';
import Country from '../country';


export default class NewCompanyApp extends Component {
  componentWillMount() {
  }

  render() {
    return (
      <AltContainer stores={ {addStore: AddCompanyStore} } >
        <CompanyAddPanel history={this.props.history}/>
      </AltContainer>
    );
  }
}

class CompanyAddPanel extends Component {
  componentWillMount() {
    AddCompanyActions.resetData();
  }

  componentDidUpdate() {
    if(this.props.addStore.isSubmitted) this.props.history.pushState(null, "/Companies");
  }

  handleValidate = () => {
    let addForm = this.refs.form;
    AddCompanyActions.postData();
  }

  render() {
    return (
      <div className="ui raised segment container" >
        <CompanyAddHeader handleValidate={this.handleValidate}/>
        <CompanyAddForm ref='form' schema={this.props.addStore}/>
      </div>
    );

  }
}

class CompanyAddForm extends Component {

  getData(){
    console.log(this.props.schema)
    return this.props.schema.getData();
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
                <InputFormElement field={this.props.schema.fields.name}/>
              </div>
              <div className="four wide column">
                <InputFormElement field={this.props.schema.fields.age}/>
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
    this.props.field.register();
  }

  handleChange = () => {
    let value = this.refs[this.props.field.key].getDOMNode().value;
    AddCompanyActions.fieldChanged({field: this.props.field, value: value});
  }

  // fieldValue(){
  //   let {error, value} = this.props.field;
  //   if(error)throw new Error(this.props.field.errorMessage(value));
  //   this.setState({ error: this.props.field.checkValue(value) })
  //   if(this.state.error) throw new Error(error);
  //   return value;
  // }

  fieldClassName = () => {
    let klasses = ['field'];
    if(this.props.field.isRequired()) klasses.push('required');
    if(this.props.field.error) klasses.push('error');
    return klasses.join(' ');
  }

  render(){
    let element = this;
    let styles={
      errorMessage:{
        get display(){return element.props.field.error ? '' : 'none'},
      }
    }

    return(
      <div className={this.fieldClassName()}>
        <label>{this.props.field.label}</label>
        <input ref={this.props.field.key} type="text" value={this.props.field.value} placeholder={this.props.field.label} onChange={this.handleChange}/>
        <div style={styles.errorMessage} className="ui pointing red basic label">
          {this.props.field.error}
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
    $('.dropdown.addActions').dropdown({
      onChange: (text, value) => {
        console.log("BACK")
        AddCompanyActions.resetData();
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
                <div className="item" data-value="reset"> Reset inputs </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

