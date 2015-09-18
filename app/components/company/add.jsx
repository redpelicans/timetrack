import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import CompanyStore from './store';
import CompanyActions from './actions';
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
    let styles = {
      layout:{
        maxWidth: '1080px'
      },
      card:{
        alignItems: 'center',
      },
    };

    let companyRows=[];

    return (
      <div className="mdl-color--white mdl-shadow--2dp mdl-grid" style={styles.layout}>
        <div style={styles.card} className="mdl-cell mdl-cell--12-col">
          <CompanyAddHeader handleValidate={this.handleValidate}/>
          <CompanyAddForm ref='form'/>
        </div>
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
   let styles = {
      bloc:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'flex-start',
        height: '50px',
        color: '#757575 !important',
      },
      icon:{
        order: 1,
        flex: '0 0 5%',
        paddingLeft: '40px',
        paddingRight: '40px',
      },
      input:{
        order: 2,
      }
    }

    return (
    <div className="mdl-grid">
      <div className="mdl-cell mdl-cell--3-col">
      </div>
      <div className="mdl-cell mdl-cell--6-col">
        <InputFormElement icon='business' attr='name'/>
        <InputFormElement attr='age'/>
        <InputFormElement icon='local_post_office' attr='address.street'/>
        <InputFormElement attr='address.zip'/>
        <InputFormElement attr='address.city'/>
        <SelectFormElement attr='address.country'/>
      </div>
      <div className="mdl-cell mdl-cell--3-col">
      </div>
    </div>
    )
  }
}

@formo.input(addCompanySchema)
class SelectFormElement extends Component {

  handleChangeSelect = () => {
    // TODO
    let key = this.refs[this.attrKey].getDOMNode().value;
    let res = _.filter(this.attrDef.values, (value) => { return value.indexOf(key) !== -1});
    if(res.length) this.setState({value: res[0]});
    else this.setState({value: key});
  }

  render(){
    let element = this;

    let styles = {
      row:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'flex-start',
        height: '60px',
        color: '#757575 !important',
      },
      icon:{
        order: 1,
        flex: '0 0 5%',
        paddingLeft: '40px',
        paddingRight: '40px',
      },
      input:{
        order: 2,
        flex: '1 1 auto',
      },
      required:{
        color: 'orange',
        fontSize: '12px',
        marginLeft: '10px',
      },
      select:{
        order: 3,
        flex: '1 1 100%',
      },
      error:{
        order: 4,
        flex: '0 0 5%',
        color: '#de3226',
        marginLeft: '10px',
        get display(){return element.state.error ? 'block' : 'none'},
      }
    }


    return(
      <div style={styles.row}>
        <div style={styles.icon}>
          <i className="material-icons">{this.props.icon}</i>
        </div>
        <div style={styles.input}>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input className="mdl-textfield__input" type="text" pattern={this.pattern} value={this.state.value} id={this.attrKey} ref={this.attrKey} onChange={this.handleChange}/>
            <label className="mdl-textfield__label" htmlFor={this.attrKey}>
              {this.label}
              {this.isRequired() && this.hasNoValue() ? <span style={styles.required} >(required)</span> : ''}
            </label>
            <span className="mdl-textfield__error">{this.inputMessage}</span>
          </div>
        </div>
        <div style={styles.error}>
          <div className="icon material-icons">error</div>
        </div>
      </div>
    )
  }
}



@formo.input(addCompanySchema)
class InputFormElement extends Component {

  render(){
    let element = this;
    let styles = {
      row:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'flex-start',
        height: '60px',
        color: '#757575 !important',
      },
      icon:{
        order: 1,
        flex: '0 0 5%',
        paddingLeft: '40px',
        paddingRight: '40px',
      },
      input:{
        order: 2,
        flex: '1 1 100%',
      },
      required:{
        color: 'orange',
        fontSize: '12px',
        marginLeft: '10px',
      },
      error:{
        order: 3,
        flex: '0 0 5%',
        color: '#de3226',
        marginLeft: '10px',
        get display(){return element.state.error ? 'block' : 'none'},
      }
    }

    return(
      <div style={styles.row}>
        <div style={styles.icon}>
          <i className="material-icons">{this.props.icon}</i>
        </div>
        <div style={styles.input}>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input className="mdl-textfield__input" type="text" pattern={this.pattern} value={this.state.value} id={this.attrKey} ref={this.attrKey} onChange={this.handleChange}/>
            <label className="mdl-textfield__label" htmlFor={this.attrKey}>
              {this.label}
              {this.isRequired() && this.hasNoValue() ? <span style={styles.required} >(required)</span> : ''}
            </label>
            <span className="mdl-textfield__error">{this.inputMessage}</span>
          </div>
        </div>
        <div style={styles.error}>
          <div className="icon material-icons">error</div>
        </div>
      </div>
    )
  }
}

class CompanyAddHeader extends Component {

  render(){
    let styles={
      header:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: '#757575 !important',
        height: '64px',
      },
      title: {
        marginLeft: '20px',
        fontFamily: 'Roboto',
        fontSize: '20px',
        letterSpacing: '.02em',
        color: '#757575 !important',
        fontWeight: 400,
        lineHeight: '32px',
        order:1,
        flex: '1 1 auto'
      },
      leftHeader:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        order: 3,
      },
      search:{
        order: 1,
      },
      starred:{
        order:2,
      },
      sort:{
        order:3,
      },
      menu:{
        order:4,
      },
      close:{
        order: 0,
        marginLeft: '12px',
        marginRight: '12px',
        //flex: '0 1 3%',
      }
    }

    return(
    <div className="mdl-grid">
      <div className="mdl-cell mdl-cell--12-col">
        <div style={styles.header}>
          <div style={styles.close}>
            <button onClick={this.props.handleValidate} className="mdl-button mdl-js-button mdl-button--icon">
              <i className="material-icons">keyboard_backspace</i>
            </button>
          </div>
          <div style={styles.title}>
            <span> Add a company</span>
          </div>
          <div style={styles.leftHeader}>
            <div style={styles.menu}>
              <CompanyAddActions/>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}
class CompanyAddActions extends Component {

  handle = (key) => {
  }

  render(){

    let menu = {
      name: "Cancel updates",
    }

    let menuItems = _.map(menu, (value, key) => {
      return <li className="mdl-menu__item" onClick={this.handle.bind(null, key)}>{value}</li>
    });

    return (
      <div>
        <button id="companyAddMenu" className="mdl-button mdl-js-button mdl-button--icon">
          <i className="material-icons">more_vert</i>
        </button>
        <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-left" htmlFor="companyAddMenu">
          {menuItems}
        </ul>
      </div>
    )
  }
}


