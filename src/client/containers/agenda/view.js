import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {agendaSelector} from '../../selectors/agenda'
import {eventsActions} from '../../actions/events'
import {missionsActions} from '../../actions/missions'
import {personsActions} from '../../actions/persons'
import {agendaActions} from '../../actions/agenda'
import Immutable from 'immutable'
import moment from 'moment'
import {Header, HeaderLeft, HeaderRight, TitleIcon, IconButton, ToggleBox} from '../../components/widgets'
import routes from '../../routes'
import {pushRoute} from '../../actions/routes'
import Agenda from '../../components/agenda'
import Multiselect from 'react-widgets/lib/Multiselect'
import agendaForm from '../../forms/agenda'
import {MultiSelectField2} from '../../components/fields'

class App extends Component {


  componentWillUnmount(){
    if(this.unsubscribeState) this.unsubscribeState()
  }

  componentWillMount() {
    const {from, to, missionIds, workerIds} = this.props.agenda;

    this.agendaForm =  agendaForm({workerIds, missionIds})

    this.unsubscribeState = this.agendaForm.onValue( state => {
      this.props.dispatch(agendaActions.changeFilter({missionIds: state.missionIds.value, workerIds: state.workerIds.value}))
    })

    this.initDomainValues(this.props)

    this.props.dispatch(missionsActions.load())
    this.props.dispatch(personsActions.load())
    this.props.dispatch(agendaActions.load(from, to));
  }

  initDomainValues(props){
    const {workers, missions} = props;

    const workerIdsField = this.agendaForm.field('workerIds')
    const workerValues = entitiesDomain(workers)
    workerIdsField.setSchemaValue('domainValue', workerValues)

    const missionIdsField = this.agendaForm.field('missionIds')
    const missionValues = entitiesDomain(missions)
    missionIdsField.setSchemaValue('domainValue', missionValues)
  }
  
  componentWillReceiveProps(nextProps){
    if(this.props.persons !== nextProps.persons || this.props.missions != nextProps.missions) this.initDomainValues(nextProps)
  }

  handleAddPeriod = () => {
    this.props.dispatch(agendaActions.addPeriod(1));
  }

  handleSubtractPeriod = () => {
    this.props.dispatch(agendaActions.subtractPeriod(1));
  }

  handleGotoToday = () => {
    this.props.dispatch(agendaActions.gotoToday());
  }

  handlePeriodSelection = (from, to) => {
    this.props.dispatch(pushRoute(routes.event.new, {from, to}));
  }

  render(){
    const {agenda, events, isLoading, persons, missions} = this.props;

    return (
        <Content>
          <Header>
            <HeaderLeft>
              <TitleIcon isLoading={isLoading} icon={routes.agenda.view.iconName}/>
              <DateTitle date={agenda.from}/>
            </HeaderLeft>
            <HeaderRight>
              <IconButton onClick={this.handleSubtractPeriod} name={'arrow-left'} label={'previous month'}/>
              <IconButton onClick={this.handleGotoToday} name={'stop-circle'} label={'today'}/>
              <IconButton onClick={this.handleAddPeriod} name={'arrow-right'} label={'next month'}/>
            </HeaderRight>
          </Header>
          <ToggleBox hidden={true} label="filter">
            <ControlPanel form={this.agendaForm}/>
          </ToggleBox>
          <Agenda 
            viewMode={agenda.viewMode} 
            date={agenda.from} 
            events={events}
            persons={persons}
            missions={missions}
            onPeriodSelection={this.handlePeriodSelection}/>
        </Content>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  agenda: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  workers: PropTypes.object.isRequired,
  missions: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
}

class Content extends Component {
  render(){
    const style={
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }

    return (
      <div style={style} className="col-xs-12 col-md-8 col-md-offset-2">
        {this.props.children}
      </div>
    )
  }
}
const DateTitle = ({date}) => {
  const style = {
    display: "inline-block",
    textAlign: "center",
    //width: "100px"
  }

  return (
    <span style={style}>{date.format('MMMM YYYY')}</span>
  )
}

DateTitle.propTypes = {
  date: PropTypes.object.isRequired,
}

class ControlPanel extends Component{

  render(){
    const {form} = this.props
    const styles={
      container:{
      }
    }
    return (
      <div className="row">
        <div className="col-md-6">
          <MultiSelectField2 field={form.field('workerIds')}/>
        </div>
        <div className="col-md-6">
          <MultiSelectField2 field={form.field('missionIds')}/>
        </div>
      </div>
    )
  }
}

ControlPanel.propTypes = {
  form: PropTypes.object.isRequired,
}

function  entitiesDomain(entities){
  if(!entities) return []
  const res = entities.toSetSeq().map(v => {
    return {key: v.get('_id'), value: v.get('name')} 
  });
  return res.toJS().sort( (a, b) => a.value > b.value );
}

export default connect(agendaSelector)(App)
