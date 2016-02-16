import _ from 'lodash'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Immutable from 'immutable'
import personForm, {colors, avatarTypes} from '../../forms/person'
import {personsActions} from '../../actions/persons'
import {skillsActions} from '../../actions/skills'
import {companiesActions} from '../../actions/companies'
import {goBack, replace} from '../../actions/routes'
import {Content} from '../../components/layout'
import {Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn, Header, HeaderLeft, HeaderRight, GoBack, Title} from '../../components/widgets'
import {StarField, AvatarChooserField, AvatarViewField, MarkdownEditField, InputField, MultiSelectField, DropdownField} from '../../components/fields'
import TagsField from '../tags'
import {PhonesField} from '../../components/phone'
import sitemap from '../../routes'
import {newPersonSelector, editPersonSelector} from '../../selectors/persons'

class NewPerson extends Component {

  state = {
    forceLeave: false,
  }

  routerWillLeave = nextLocation => {
    if(!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving new person?"
    return true
  }

  componentDidMount(){
    const {route} = this.props
    const {router} = this.context
    router.setRouteLeaveHook(route, this.routerWillLeave)
  }

  handleSubmit = () => {
    this.personForm.submit()
  }

  handleCancel = () => {
    this.goBack(false)
  }

  goBack = (forceLeave) => {
    this.setState({forceLeave: forceLeave}, () => {
      this.props.dispatch(goBack())
    })
  }

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit()
    if(this.unsubscribeState) this.unsubscribeState()
  }

  componentWillMount() {
    const {dispatch, companyId, companies, skills} = this.props
    this.personForm =  companyId ? personForm({companyId}) : personForm()

    this.unsubscribeSubmit = this.personForm.onSubmit( (state, document) => {
      dispatch(personsActions.create(document))
      this.goBack(true)
    })

    this.unsubscribeState = this.personForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      })
    })

    const companyField = this.personForm.field('companyId')
    const skillsField = this.personForm.field('skills')
    companyField.setSchemaValue('domainValue', companiesDomain(companies))
    skillsField.setSchemaValue('domainValue', skills.toJS() || [])

    dispatch(companiesActions.load())
    dispatch(skillsActions.load())
  }

  render(){
    const {userCompanyId, companies} = this.props

    let submitBtn = <AddBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit}/>
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>

    return (
      <div>
        <EditContent 
          userCompanyId={userCompanyId}
          companies={companies}
          title={"Add a Person"} 
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          goBack={this.goBack}
          personForm={this.personForm}/>
      </div>
    )
  }
}

NewPerson.contextTypes = {
  router: PropTypes.object.isRequired
}


NewPerson.propTypes = {
  userCompanyId:  PropTypes.string,
  companyId:      PropTypes.string,
  companies:      PropTypes.object,
  skills:         PropTypes.object,
  dispatch:       PropTypes.func.isRequired
}

class EditPerson extends Component {
  state = {
    forceLeave: false,
  }

  routerWillLeave = nextLocation => {
    if(!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving updates?"
    return true
  }

  componentDidMount() {
    const {route} = this.props
    const {router} = this.context
    router.setRouteLeaveHook(route, this.routerWillLeave)
  }

  handleSubmit = () => {
    this.personForm.submit()
  }

  handleCancel = () => {
    this.goBack(false)
  }

  goBack = (forceLeave) => {
    this.setState({forceLeave: forceLeave}, () => {
      this.props.dispatch(goBack())
    })
  }

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit()
    if(this.unsubscribeState) this.unsubscribeState()
  }

  componentWillMount() {
    const {dispatch, person, companies, skills} = this.props

    if (!person) return dispatch(replace(sitemap.person.list))

    this.personDocument = person.toJS()
    this.personForm = personForm(this.personDocument)

    this.unsubscribeSubmit = this.personForm.onSubmit( (state, document) => {
      dispatch(personsActions.update(this.personDocument, document))
      this.goBack(true)
    })

    this.unsubscribeState = this.personForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      })
    })

    const companyField = this.personForm.field('companyId')
    const skillsField = this.personForm.field('skills')
    companyField.setSchemaValue('domainValue', companiesDomain(companies))
    skillsField.setSchemaValue('domainValue', skills.toJS() || [])

    dispatch(personsActions.load({ids: [person.get('_id')]}))
    dispatch(companiesActions.load())
    dispatch(skillsActions.load())
  }
  render(){
    const {userCompanyId, companies} = this.props
    if(!this.personDocument) return false

    let submitBtn = <UpdateBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit && this.state.hasBeenModified}/>
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>

    return (
      <div>
        <EditContent 
          userCompanyId={userCompanyId}
          companies={companies}
          title={"Edit Person"} 
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          goBack={this.goBack}
          personDocument={this.personDocument} 
          personForm={this.personForm}/>
      </div>
    )
  }
}

EditPerson.contextTypes = {
  router: PropTypes.object.isRequired
}

EditPerson.propTypes = {
  userCompanyId:  PropTypes.string,
  person:         PropTypes.object,
  company:        PropTypes.object,
  companies:      PropTypes.object,
  skills:         PropTypes.object,
  dispatch:       PropTypes.func.isRequired
}

class EditContent extends Component {
  state = {}

  editMode = !!this.props.personDocument

  componentWillMount(){
    //this.editMode = !!this.props.personDocument
    // dynamic behavior
    emailRule(this.props.personForm)
    companyRule(this.props.personForm, this.props.userCompanyId, this.props.companies)

    const type = this.props.personForm.field('type')
    type.onValue( state => this.setState({isWorker: state.value === 'worker'}))
  }

  render(){
    const person = this.props.personForm
    if(!person) return false

    let styles = {
      time: {
        fontSize: '.7rem',
        fontStyle: 'italic',
        display: 'block',
        float: 'right',
      }
    }

    const fakePerson = Immutable.fromJS(_.pick(this.props.personDocument, 'createdAt', 'updatedAt'))

    const companyField = person.field('companyId')

    const skills = () => {
      if(!this.state.isWorker) return <div/>
      return (
        <div className="col-md-12">
          <MultiSelectField field={person.field('skills')} allowCreate={true}/>
        </div>
      )
    }

    const roles = () => {
      //if(!this.state.isWorker) return <div/>
      return (
        <div className="col-md-12">
          <MultiSelectField field={person.field('roles')}/>
        </div>
      )
    }

    const note = () => {
      if(this.editMode)return <div/>
      return (
        <div className="col-md-12">
          <MarkdownEditField field={person.field('note')}/>
        </div>
      )
    }

    const tags = () => {
      if(this.editMode)return <div/>
      return (
        <div className="col-md-12">
          <TagsField field={person.field('tags')}/>
        </div>
      )
    }

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">

            <Header obj={fakePerson}>
              <HeaderLeft>
                <GoBack goBack={this.props.goBack}/>
                <AvatarViewField type='person' obj={person}/>
                <Title title={this.props.title}/>
              </HeaderLeft>
              <HeaderRight>
                {this.props.submitBtn}
                {this.props.cancelBtn}
                <ResetBtn obj={person}/>
              </HeaderRight>
            </Header>

          </div>
          <div className="col-md-12 m-b"/>
          <div className="col-md-12">
            <Form>
              <div className="row">
                <div className="col-md-3">
                  <DropdownField field={person.field('prefix')}/>
                </div>
                <div className="col-md-4">
                  <InputField field={person.field('firstName')}/>
                </div>
                <div className="col-md-4">
                  <InputField field={person.field('lastName')}/>
                </div>
                <div className="col-md-1">
                  <StarField field={person.field('preferred')}/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <DropdownField field={person.field('type')}/>
                </div>
                <div className="col-md-6">
                  <InputField field={person.field('email')}/>
                </div>
                <div className="col-md-3">
                  <DropdownField field={person.field('jobType')}/>
                </div>
                <div className="col-md-12">
                  <DropdownField field={companyField}/>
                </div>
                <div className="col-md-12">
                  <PhonesField field={person.field('phones')} />
                </div>
                {tags()}
                {skills()}
                {roles()}
                <AvatarChooser person={person}/>
                <div className="col-md-12">
                  <MarkdownEditField field={person.field('jobDescription')}/>
                </div>
                {note()}
              </div>
            </Form>
          </div>
        </div>
      </Content>
    )
  }
}

EditContent.propTypes = {
  title:          PropTypes.string.isRequired,
  submitBtn:      PropTypes.element.isRequired,
  cancelBtn:      PropTypes.element.isRequired,
  goBack:         PropTypes.func.isRequired,
  personForm:     PropTypes.object.isRequired,
  userCompanyId:  PropTypes.string.isRequired,
  companies:      PropTypes.object.isRequired,
  personDocument: PropTypes.object
}

class AvatarChooser extends Component{
  componentWillMount(){
    const type = this.props.person.field('type')
    type.onValue( state => {
      this.setState({value: state.value})
    })
  }

  render(){
    if(this.state.value === 'worker'){
      return <div/>
    }else{
      return (
        <div className="col-md-12">
          <AvatarChooserField field={this.props.person.field('avatar')}/>
        </div>
      )
    }
  }
}

AvatarChooser.propTypes = {
  person: PropTypes.object.isRequired
}

function companyRule(person, userCompanyId, companies){
  const type = person.field('type')
  const companyField = person.field('companyId')

  type.onValue( state => {
    if(state.value === 'worker'){
      companyField.setValue(userCompanyId)
      companyField.disabled(true)
    }else{
      companyField.disabled(false)
    }
  })
}

function emailRule(person){
  const type = person.field('type')
  const email = person.field('email')

  type.onValue( state => {
    if(state.value === 'worker'){
      email.setSchemaValue('required', true)
    }else{
      email.setSchemaValue('required', false)
    }
  })
}

function  companiesDomain(companies){
  if(!companies) return []
  const values = _.chain(companies.toJS())
    .map(company => { return {key: company._id, value: company.name} })
    .sortBy(x => x.value)
    .value()
  values.unshift({key: undefined, value: '<No Company>'})
  return values
}

export const NewPersonApp = connect(newPersonSelector)(NewPerson)
export const EditPersonApp = connect(editPersonSelector)(EditPerson)

