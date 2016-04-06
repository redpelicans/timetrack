import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {agendaSelector} from '../../selectors/agenda'
import {eventsActions} from '../../actions/events'
import {missionsActions} from '../../actions/missions'
import {personsActions} from '../../actions/persons'
import {agendaActions} from '../../actions/agenda'
import Immutable from 'immutable'
import moment from 'moment'
import {Content} from '../../components/layout'
import {Header, HeaderLeft, HeaderRight, TitleIcon, IconButton} from '../../components/widgets'
import routes from '../../routes'
import {pushRoute} from '../../actions/routes';
import Agenda from '../../components/agenda'

class App extends Component {

  componentWillMount() {
    const {from, to} = this.props.agenda;
    this.props.dispatch(missionsActions.load())
    this.props.dispatch(personsActions.load())
    this.props.dispatch(agendaActions.load(from, to));
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
    const {agenda, events, isLoading, workers, missions} = this.props;
    return (
      <Content>
        <Header>
          <HeaderLeft>
            <TitleIcon isLoading={isLoading} icon={routes.agenda.list.iconName}/>
            <DateTitle date={agenda.from}/>
          </HeaderLeft>
          <HeaderRight>
            <IconButton onClick={this.handleSubtractPeriod} name={'arrow-left'} label={'previous month'}/>
            <IconButton onClick={this.handleGotoToday} name={'stop-circle'} label={'today'}/>
            <IconButton onClick={this.handleAddPeriod} name={'arrow-right'} label={'next month'}/>
          </HeaderRight>
        </Header>
        <AgendaApp 
          viewMode={agenda.viewMode} 
          date={agenda.from} 
          events={events}
          persons={workers}
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

const AgendaApp = ({date, viewMode, events, persons, missions, onPeriodSelection}) => {
  return (
    <Agenda 
      date={date} 
      viewMode={viewMode} 
      events={events}
      persons={persons}
      missions={missions}
      onPeriodSelection={onPeriodSelection}/>
  )
}

AgendaApp.propTypes = {
  viewMode: PropTypes.string,
  events: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
  missions: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired,
  onPeriodSelection: PropTypes.func.isRequired,
}

export default connect(agendaSelector)(App)
