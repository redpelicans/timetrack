import _ from 'lodash'
import Immutable from 'immutable'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import missionForm from '../../forms/mission'
import {goBack, replace} from '../../actions/routes'
import {missionsActions} from '../../actions/missions'
import {companiesActions} from '../../actions/companies'
import {personsActions} from '../../actions/persons'
import {Content} from '../../components/layout'
import sitemap from '../../routes'
import {FadeIn, Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn} from '../../components/widgets'
import {AvatarView, Header, HeaderLeft, HeaderRight, GoBack, Title } from '../../components/widgets'
import {PeriodField, MultiSelectField2, MarkdownEditField, InputField, DropdownField} from '../../components/fields'
import {newMissionSelector, editMissionSelector} from '../../selectors/missions'
import {authable} from '../../components/authmanager';

export class NewMission extends Component {

  state = {
    forceLeave: false,
  }

  static contextTypes = {
    history:  PropTypes.object.isRequired,
    router:   PropTypes.object.isRequired,
  }

  routerWillLeave = nextLocation => {
    if(!this.state.forceLeave && this.state.hasBeenModified) return 'Are you sure you want to leave the page without saving new mission?'
    return true
  }

  componentDidMount() {
    const {route} = this.props
    const {router} = this.context
    router.setRouteLeaveHook(route, this.routerWillLeave)
  }

  handleSubmit = () => {
    this.missionForm.submit()
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
    const {dispatch, clientId, clients, workers, partners} = this.props
    this.missionForm =  clientId ? missionForm({clientId}) : missionForm()

    this.unsubscribeSubmit = this.missionForm.onSubmit( (state, mission) => {
      dispatch(missionsActions.create(mission))
      this.goBack(true)
    })

    this.unsubscribeState = this.missionForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      })
    })

    const clientIdField = this.missionForm.field('clientId')
    const managerIdField = this.missionForm.field('managerId')
    const workerIdsField = this.missionForm.field('workerIds')
    const partnerIdField = this.missionForm.field('partnerId')

    let partnersDomainValue = entitiesDomain(partners)
    partnersDomainValue.unshift({key: undefined, value: '<No Partner>'})

    clientIdField.setSchemaValue('domainValue', entitiesDomain(clients))
    managerIdField.setSchemaValue('domainValue', entitiesDomain(workers))
    workerIdsField.setSchemaValue('domainValue', entitiesDomain(workers))
    partnerIdField.setSchemaValue('domainValue', partnersDomainValue)

    dispatch(companiesActions.load()) //load only clients
    dispatch(personsActions.load()) //load only workers
  }

  render(){
    const {clients} = this.props
    if(!clients)return false

    let submitBtn = <AddBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit}/>
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>


    return (
      <EditContent
        title={"Add a Mission"}
        submitBtn={submitBtn}
        cancelBtn={cancelBtn}
        goBack={this.goBack}
        clients={clients}
        missionForm={this.missionForm}/>
    )
  }
}

NewMission.propTypes = {
  clientId:     PropTypes.string,
  partners:     PropTypes.object,
  clients:      PropTypes.object,
  workers:      PropTypes.object,
  dispatch:     PropTypes.func.isRequired,
}

class EditMission extends Component {

  state = {
    forceLeave: false,
  };

  routerWillLeave = nextLocation => {
    if(!this.state.forceLeave && this.state.hasBeenModified) return 'Are you sure you want to leave the page without saving updates?'
    return true
  }

  componentDidMount() {
    const {route} = this.props
    const {router} = this.context
    router.setRouteLeaveHook(route, this.routerWillLeave)
  }

  handleSubmit = () => {
    this.missionForm.submit()
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
    const {dispatch, mission, clients, workers, partners} = this.props
    if (!mission)
    {
      this.props.dispatch(replace(sitemap.mission.list))
      return
    }

    this.missionDocument = mission.toJS()
    this.missionForm = missionForm(this.missionDocument)

    this.unsubscribeSubmit = this.missionForm.onSubmit( (state, mission) => {
      dispatch(missionsActions.update(this.missionDocument, mission))
      this.goBack(true)
    })

    this.unsubscribeState = this.missionForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      })
    })

   const clientIdField = this.missionForm.field('clientId')
   const managerIdField = this.missionForm.field('managerId')
   const workerIdsField = this.missionForm.field('workerIds')
   const partnerIdField = this.missionForm.field('partnerId')

   let partnersDomainValue = entitiesDomain(partners)
   partnersDomainValue.unshift({key: undefined, value: '<No Partner>'})

   clientIdField.setSchemaValue('domainValue', entitiesDomain(clients))
   managerIdField.setSchemaValue('domainValue', entitiesDomain(workers))
   workerIdsField.setSchemaValue('domainValue', entitiesDomain(workers))
   partnerIdField.setSchemaValue('domainValue', partnersDomainValue)

   dispatch(companiesActions.load())
   dispatch(personsActions.load())
   dispatch(missionsActions.load({ids: [mission.get('_id')]}))
  }

  render(){
    const {clients} = this.props
    if(!this.missionForm || !clients) return false
    let submitBtn = <UpdateBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit && this.state.hasBeenModified}/>
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>

    return (
      <EditContent
        title={"Edit Mission"}
        submitBtn={submitBtn}
        cancelBtn={cancelBtn}
        goBack={this.goBack}
        clients={clients}
        missionDocument={this.missionDocument}
        missionForm={this.missionForm}/>
    )
  }
}

EditMission.contextTypes = {
  router: PropTypes.object.isRequired
}

EditMission.propTypes = {
  mission:      PropTypes.object,
  partners:     PropTypes.object,
  clients:      PropTypes.object,
  workers:      PropTypes.object,
  dispatch:     PropTypes.func.isRequired,
}

@authable
export default class EditContent extends Component {

  state = {};

  editMode = !!this.props.missionDocument

  componentWillUnmount() {
    this.unsubscribe()
    this.unsubscribeBilledTarget()
  }

  componentWillMount() {
    const clientIdField = this.props.missionForm.field('clientId')
    const partnerIdField = this.props.missionForm.field('partnerId')
    const billedTargetField = this.props.missionForm.field('billedTarget')

    this.unsubscribe = clientIdField.onValue( state => {
      const client = this.props.clients.get(state.value)
      this.setState({client})
    })

    this.unsubscribeBilledTarget = billedTargetField.onValue(state => {
      partnerIdField.setSchemaValue('required', (state.value === 'partner') ? true : false)
    })
  }

  render(){
    const fake = Immutable.fromJS(_.pick(this.props.missionDocument, 'createdAt', 'updatedAt'))
    const styles = {
      time: {
        fontSize: '.7rem',
        fontStyle: 'italic',
        display: 'block',
        float: 'right',
      },
      avatar: {
        paddingRight: '10px',
      },
    }
    const note = () => {
      if(this.editMode)return <div/>
      if(!this.context.authManager.notes.isAuthorized('new')) return <div/>
      return (
        <div className="row">
          <div className="col-md-12">
            <MarkdownEditField field={this.props.missionForm.field('note')}/>
          </div>
        </div>
      )
    }

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">

            <Header obj={fake}>
              <HeaderLeft>
                <GoBack goBack={this.props.goBack}/>
                <div className="m-r-1"><AvatarView obj={this.state.client}/></div>
                <Title title={this.props.title}/>
              </HeaderLeft>
              <HeaderRight>
                {this.props.submitBtn}
                {this.props.cancelBtn}
                <ResetBtn obj={this.props.missionForm}/>
              </HeaderRight>
            </Header>

          </div>
          <div className="col-md-12 m-b"/>
          <FadeIn>
            <div className="col-md-12">
              <Form>
                <div className="row">
                  <div className="col-md-6">
                    <DropdownField field={this.props.missionForm.field('clientId')}/>
                  </div>
                  <div className="col-md-6">
                    <DropdownField field={this.props.missionForm.field('partnerId')}/>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <DropdownField field={this.props.missionForm.field('billedTarget')}/>
                  </div>
                  <div className="col-md-6">
                    <DropdownField field={this.props.missionForm.field('managerId')}/>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <InputField field={this.props.missionForm.field('name')}/>
                  </div>
                  <div className="col-md-4">
                    <PeriodField
                      startDate={this.props.missionForm.field('startDate')}
                      endDate={this.props.missionForm.field('endDate')} />
                  </div>
                  <div className="col-md-2">
                    <DropdownField field={this.props.missionForm.field('timesheetUnit')}/>
                  </div>
                  <div className="col-md-2">
                    <DropdownField field={this.props.missionForm.field('allowWeekends')}/>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <MultiSelectField2 field={this.props.missionForm.field('workerIds')}/>
                  </div>
                </div>
                {note()}
              </Form>
            </div>
          </FadeIn>
        </div>
      </Content>
    )
  }
}

EditContent.propTypes = {
  clients:            PropTypes.object.isRequired,
  title:              PropTypes.string.isRequired,
  goBack:             PropTypes.func.isRequired,
  submitBtn:          PropTypes.element.isRequired,
  cancelBtn:          PropTypes.element.isRequired,
  missionForm:        PropTypes.object.isRequired,
  missionDocument:    PropTypes.object,
}

function  entitiesDomain(entities){
  if(!entities) return []
  return _.chain(entities.toJS())
    .map(x => { return {key: x._id, value: x.name} })
    .value()
}

export const NewMissionApp = connect(newMissionSelector)(NewMission)
export const EditMissionApp = connect(editMissionSelector)(EditMission)
