import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {agendaSelector} from '../../selectors/agenda'
import {eventsActions} from '../../actions/events'
import Immutable from 'immutable'
import moment from 'moment'
import {Content} from '../../components/layout'
import {Refresh, Header, HeaderLeft, HeaderRight, Title, TitleIcon} from '../../components/widgets'
import routes from '../../routes'
import AgendaApp from '../../components/agenda'

class App extends Component {

  componentWillMount() {
    const {dispatch, agenda} = this.props
    dispatch(eventsActions.load(agenda.from, agenda.to, {forceReload: true}))
  }

  handleRefresh = () => {
    const {dispatch, agenda} = this.props
    dispatch(eventsActions.load(agenda.from, agenda.to, {forceReload: true}))
  }

  render(){
    const {agenda, events, isLoading} = this.props;
    // console.log(events.toJS())
    return (
      <Content>
        <Header>
          <HeaderLeft>
            <TitleIcon isLoading={isLoading} icon={routes.agenda.list.iconName}/>
            <Title title='Agenda'/>
          </HeaderLeft>
          <HeaderRight>
            <Refresh onClick={this.handleRefresh}/>
          </HeaderRight>
        </Header>

        <AgendaApp events={events.toJS()}/>

      </Content>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  agenda: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
  missions: PropTypes.object.isRequired,
}

export default connect(agendaSelector)(App)
