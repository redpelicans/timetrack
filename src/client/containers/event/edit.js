import _ from 'lodash'
import Immutable from 'immutable'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Content} from '../../components/layout'
import sitemap from '../../routes'
import eventForm, {statusDomainValue} from '../../forms/event'
import {eventsActions} from '../../actions/events'
import {goBack, replaceRoute} from '../../actions/routes'
import {FadeIn, Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn, DeleteBtn} from '../../components/widgets'
import {AvatarView, Header, HeaderLeft, HeaderRight, GoBack, Title } from '../../components/widgets'
import {newEventSelector, editEventSelector} from '../../selectors/events'
import {PeriodField, MultiSelectField2, MarkdownEditField, InputField, DropdownField} from '../../components/fields'
import {missionsActions} from '../../actions/missions'
import {personsActions} from '../../actions/persons'
import {authable} from '../../components/authmanager'
import {isAdmin} from '../../lib/person'

class Base extends Component {

  static contextTypes = {
    router:   PropTypes.object.isRequired,
  }

  state = {
    forceLeave: false,
  }

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
    this.eventForm.submit()
  }

  handleCancel = () => {
    this.goBack(false)
  }

  goBack = (forceLeave) => {
    this.setState({forceLeave: forceLeave}, () => {
      this.props.dispatch(goBack())
    })
  }

}

class EventBase extends Base{
  manageRules(){
    const [workers, missions, user] = [this.props.authorizedWorkers, this.props.authorizedMissions, this.props.user] 
    const typeField = this.eventForm.field('type')
    const workerIdField = this.eventForm.field('workerId')
    const missionIdField = this.eventForm.field('missionId')
    let workerId

    workerIdField.onValue( state => {
      workerId = state.value
    })

    missionIdField.onValue( state => {
      const mission = missions.get(state.value)
      if(mission){
        const selectedWorkers = mission.get('workerIds').map(id => workers.get(id)).filter(x => x)
        const selectedWorkerIds = selectedWorkers.map(x => x.get('_id'))
        workerIdField.setSchemaValue('domainValue', entitiesDomain(selectedWorkers))
        if(!selectedWorkerIds.includes(workerId)){
          if(selectedWorkerIds.size === 1) workerIdField.setValue(selectedWorkerIds.first())
          else workerIdField.setValue(undefined)
        }
      }
    })

    typeField.onValue( state => {
      const missionValues = entitiesDomain(missions)
      switch(state.value){
        case 'work':
          missionIdField.disabled(false)
          missionIdField.setSchemaValue('required', true)
          missionIdField.setSchemaValue('domainValue', missionValues)
          if(missions.size === 1) missionIdField.setValue(missions.first().get('_id'))
          return
        default:
          missionIdField.setValue(undefined)
          missionIdField.disabled(true)
          missionIdField.setSchemaValue('required', false)
          const selectedWorkers = isAdmin(user) ? workers : Immutable.fromJS({[user.get('_id')]: user.toJS()})
          workerIdField.setSchemaValue('domainValue', entitiesDomain(selectedWorkers))
          workerIdField.setValue(user.get('_id'))
      }
    })
  }

  initDomainValues(){
    const [workers, missions] = [this.props.authorizedWorkers, this.props.authorizedMissions] 

    const workerIdField = this.eventForm.field('workerId')
    const missionIdField = this.eventForm.field('missionId')
    const statusField = this.eventForm.field('status')


    // const missionValues = entitiesDomain(missions)
    // missionIdField.setSchemaValue('domainValue', missionValues)
    // if(missions.size === 1) missionIdField.setValue(missions.first().get('_id'))

    if(isAdmin(this.props.user)) statusField.setSchemaValue('domainValue', statusDomainValue)
    else statusField.setSchemaValue('domainValue', [{key: 'toBeValidated', value: 'ToBeValidated'}])
  }

  componentWillReceiveProps(nextProps){
    this.initDomainValues(nextProps);
  }

}

@authable
class New extends EventBase {

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit()
    if(this.unsubscribeState) this.unsubscribeState()
  }

  componentWillMount() {
    const {dispatch, from, to, unit, value, workers, missions} = this.props
    this.eventForm =  eventForm({startDate: from.toDate(), endDate: to.toDate(), unit, value})

    this.unsubscribeSubmit = this.eventForm.onSubmit( (state, event) => {
      dispatch(eventsActions.create(event))
      this.goBack(true)
    })

    this.unsubscribeState = this.eventForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      })
    })

    this.initDomainValues()
    this.manageRules()

    dispatch(missionsActions.load())
    dispatch(personsActions.load())
  }

  render(){
    const {workers, missions} = this.props
    let submitBtn = <AddBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit}/>
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>

    return (
      <EditForm
        title={"Add an Event"}
        submitBtn={submitBtn}
        cancelBtn={cancelBtn}
        goBack={this.goBack}
        eventForm={this.eventForm}/>
    )
  }
}

New.propTypes = {
  dispatch: PropTypes.func.isRequired,
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
  missions: PropTypes.object.isRequired,
  workers: PropTypes.object.isRequired,
  authorizedWorkers: PropTypes.object.isRequired,
  authorizedMissions: PropTypes.object.isRequired,
  unit: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}


@authable
class Edit extends EventBase {
  handleDelete = () => {
    const answer = confirm(`Are you sure to delete this event`);
    if(answer){
      this.props.dispatch(eventsActions.delete(this.props.event.toJS()));
      this.goBack(true);
    }
  }

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit()
    if(this.unsubscribeState) this.unsubscribeState()
  }

  componentWillMount() {
    const {dispatch, event} = this.props
    if (!event) return this.props.dispatch(replaceRoute(sitemap.agenda.list))

    this.eventDocument = event.toJS()
    this.eventForm = eventForm(this.eventDocument)

    this.unsubscribeSubmit = this.eventForm.onSubmit( (state, event) => {
      dispatch(eventsActions.update(this.eventDocument, event))
      this.goBack(true)
    })

    this.unsubscribeState = this.eventForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      })
    })

    this.initDomainValues()
    this.manageRules()
  }

  render(){
    if(!this.eventForm) return false
    let submitBtn = <UpdateBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit && this.state.hasBeenModified}/>
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>
    let deleteBtn = this.context.authManager.event.isAuthorized('delete', {event: this.props.event}) ? <DeleteBtn onDelete={this.handleDelete}/> : <div/>

    return (
      <EditForm
        title={"Edit Event"}
        submitBtn={submitBtn}
        cancelBtn={cancelBtn}
        deleteBtn={deleteBtn}
        goBack={this.goBack}
        eventDocument={this.eventDocument}
        eventForm={this.eventForm}/>
    )
  }
}

Edit.propTypes = {
  event: PropTypes.object,
  missions: PropTypes.object.isRequired,
  workers: PropTypes.object.isRequired,
  authorizedWorkers: PropTypes.object.isRequired,
  authorizedMissions: PropTypes.object.isRequired,
  unit: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
}

class EditForm extends Component {
  //editMode = !!this.props.eventDocument

  render(){
    const {eventForm, eventDocument, goBack, title, submitBtn, cancelBtn, deleteBtn} = this.props
    const fake = Immutable.fromJS(_.pick(eventDocument, 'createdAt', 'updatedAt'))
    const styles = {
      time: {
        fontSize: '.7rem',
        fontStyle: 'italic',
        display: 'block',
        float: 'right',
      }
    }

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">

            <Header obj={fake}>
              <HeaderLeft>
                <GoBack goBack={goBack}/>
                <Title title={title}/>
              </HeaderLeft>
              <HeaderRight>
                {submitBtn}
                {cancelBtn}
                {deleteBtn ? deleteBtn : <ResetBtn obj={eventForm}/>}
              </HeaderRight>
            </Header>

          </div>
          <div className="col-md-12 m-b"/>
          <FadeIn>
            <div className="col-md-12">
              <Form>
                <div className="row">
                  <div className="col-md-8">
                    <PeriodField
                      startDate={eventForm.field('startDate')}
                      endDate={eventForm.field('endDate')} />
                  </div>
                  <div className="col-md-2">
                    <DropdownField field={eventForm.field('unit')}/>
                  </div>
                  <div className="col-md-2">
                    <InputField field={eventForm.field('value')}/>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-2">
                    <DropdownField field={eventForm.field('type')}/>
                  </div>
                  <div className="col-md-4">
                    <DropdownField field={eventForm.field('missionId')}/>
                  </div>
                  <div className="col-md-4">
                    <DropdownField field={eventForm.field('workerId')}/>
                  </div>
                  <div className="col-md-2">
                    <DropdownField field={eventForm.field('status')}/>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <MarkdownEditField field={eventForm.field('description')}/>
                  </div>
                </div>
              </Form>
            </div>
          </FadeIn>
        </div>
      </Content>
    )
  }
}

EditForm.propTypes = {
  title:              PropTypes.string.isRequired,
  goBack:             PropTypes.func.isRequired,
  submitBtn:          PropTypes.element.isRequired,
  cancelBtn:          PropTypes.element,
  deleteBtn:          PropTypes.element,
  eventForm:        PropTypes.object.isRequired,
  eventDocument:    PropTypes.object,
}

function  entitiesDomain(entities){
  if(!entities) return []
  const res = entities.toSetSeq().map(v => {
    if(!v) return {key: null, value: 'Unknown Entity'}
    return {key: v.get('_id'), value: v.get('name')}
  });
  return res.toJS().sort( (a, b) => a.value > b.value );
}

export const NewEventApp = connect(newEventSelector)(New)
export const EditEventApp = connect(editEventSelector)(Edit)
