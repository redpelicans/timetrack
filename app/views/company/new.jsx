import _ from 'lodash';
import React, {Component} from 'react';
import routes from '../../routes';
import classNames from 'classnames';
import Avatar from '../avatar';
import {Content, Header, Actions} from '../layout';
import newCompany from '../../forms/new_company';
import {InputField, SelectField, SelectField2} from '../../utils/formo_fields';

export default class CompanyListApp extends Component {

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  handleCancel = () => {
    console.log('CANCEL');
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    //this.unsubscribeModel();
  }

  render(){
    let href = this.context.history.createHref(routes.companies.path);
    let leftIcon = <a href={href} className="fa fa-arrow-left m-r"/>;

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">
            <Header leftIcon={leftIcon} title={'Add a Company'}>
              <Actions>
                <Cancel onClick={this.handleCancel}/>
              </Actions>
            </Header>
          </div>
          <div className="col-md-12">
            <Form>
              <div className="row">
                <div className="col-md-9">
                  <InputField field={newCompany.field('name')}/>
                </div>
                <div className="col-md-3">
                  <SelectField2 field={newCompany.field('type')}/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-9">
                  <InputField field={newCompany.field('logoUrl')}/>
                </div>
                <div className="col-md-1">
                  <AvatarField company={newCompany}/>
                </div>
                <div className="col-md-2">
                  <InputField field={newCompany.field('color')}/>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Content>
    )
  }

}

class AvatarField extends Component{
  state = {name: 'Red Pelicans'};

  componentDidMount(){
    this.props.company.state.onValue( state => {
      this.setState({
        name: state.name.value,
        src: state.logoUrl.value,
      })
    });
  }

  render(){
    let avatarStyle={marginLeft: 'auto', marginRight: 'auto'};
    let avatar = this.state.src ? <Avatar id="avatar" src={this.state.src} css={avatarStyle}/> :  <Avatar id="avatar"  css={avatarStyle} name={this.state.name}/>;
    return (
      <fieldset className="form-group">
        <label htmlFor="avatar" >Avatar</label>
        {avatar}
      </fieldset>
    )
  }
}

class Form extends Component {
  render(){
    return(
      <form>
        {this.props.children}
      </form>
    )
  }
}


class Cancel extends Component {
  handleChange = (e) => {
    this.props.onClick();
    e.preventDefault();
  }

  render(){
    let style={
      fontSize: '1.5rem',
      color: 'grey',
    }

    return (
      <div className="p-a">
        <a href="#" onClick={this.handleChange} style={style} className="fa fa-undo"/>
      </div>
    )
  }
}


