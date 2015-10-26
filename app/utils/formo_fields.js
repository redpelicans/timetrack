import React, {Component} from 'react';
import classNames from 'classnames';
import Select from 'react-select';


export class InputField extends Component {
  state = {}

  componentDidMount(){
    this.props.field.state.onValue( v => {
      this.setState(v);
    });
  }

  handleChange = (e) => {
    this.props.field.setValue( e.target.value );
  }

  render(){
    let field = this.props.field;
    let message = () => {
      if(this.state.error)return this.state.error;
      if(this.props.field.isRequired() && this.props.field.isNull(this.state.value))return "Field is required.";
    }
    let hasError = () => {
      return this.state.error || this.props.field.isRequired() && this.props.field.isNull(this.state.value);
    }

    let fieldsetClassNames = classNames( "form-group", { 'has-error': hasError() });
    let inputClassNames= classNames( 'tm input form-control', { 'form-control-error': hasError() });

    return(
      <fieldset className={fieldsetClassNames}>
        <label htmlFor={field.key}>{field.label}</label>
        <input className={inputClassNames} id={field.key} type={field.htmlType()} value={this.state.value} placeholder={field.label} onChange={this.handleChange}/>
        <small className="text-muted control-label">{message()}</small>
      </fieldset>
    )
  }
}

export class SelectField extends Component {
  state = {}

  componentDidMount(){
    this.props.field.state.onValue( v => {
      this.setState(v);
    });
  }

  handleChange = (e) => {
    this.props.field.setValue( e.target.value );
  }

  render(){
    let field = this.props.field;
    let message = () => {
      if(this.props.field.isRequired() && this.props.field.isNull(this.state.value))return "Field is required.";
    }
    let hasError = () => {
      return this.props.field.isRequired() && this.props.field.isNull(this.state.value);
    }

    let fieldsetClassNames = classNames( "form-group", { 'has-error': hasError() });
    let selectClassNames= classNames( 'tm select form-control', { 'form-control-error': hasError() });
    let menu = _.map(field.domainValues, value => {
      return <option key={value} value={value}>{value}</option>
    });

    return(
      <fieldset className={fieldsetClassNames}>
        <label htmlFor={field.key}>{field.label}</label>
        <select className={selectClassNames} value={this.state.value} id={field.key} onChange={this.handleChange}>
          {menu}
        </select>
        <small className="text-muted control-label">{message()}</small>
      </fieldset>
    )
  }
}

export class SelectField2 extends Component {
  state = {}

  componentDidMount(){
    this.props.field.state.onValue( v => {
      this.setState(v);
    });
  }

  handleChange = (value) => {
    this.props.field.setValue( value );
  }

  render(){
    let field = this.props.field;
    let message = () => {
      if(this.props.field.isRequired() && this.props.field.isNull(this.state.value))return "Field is required.";
    }
    let hasError = () => {
      return this.props.field.isRequired() && this.props.field.isNull(this.state.value);
    }

    let fieldsetClassNames = classNames( "form-group", { 'has-error': hasError() });
    let selectClassNames= classNames( 'tm select form-control', { 'form-control-error': hasError() });
    let options = _.map(field.domainValues, value => {return {label:value, value:value}} );

    return(
      <fieldset className={fieldsetClassNames}>
        <label htmlFor={field.key}>{field.label}</label>
        <Select options={options}  value={this.state.value} id={field.key} onChange={this.handleChange}/>
        <small className="text-muted control-label">{message()}</small>
      </fieldset>
    )
  }
}




// export class InputMultiTextField extends Component {
//   render(){
//     let schema = this.props.field;
//     return(
//       <div>
//         <input className="tm input form-control" type='text' placeholder={schema.amount.label} onChange={this.handleChange}/>
//       </div>
//     )
//   }
// }
//



