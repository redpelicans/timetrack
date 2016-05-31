import _ from 'lodash'
import Immutable from 'immutable'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Content} from '../../components/layout'
import sitemap from '../../routes'
import {goBack, replaceRoute} from '../../actions/routes'
import {FadeIn} from '../../components/widgets'
import {AvatarView, Header, HeaderLeft, HeaderRight, GoBack, Title, TextLabel, DateLabel, MarkdownText } from '../../components/widgets'
import {viewEventSelector} from '../../selectors/events'
import {authable} from '../../components/authmanager'

import {PeriodField, MultiSelectField2, MarkdownEditField, InputField, DropdownField} from '../../components/fields'


@authable
class View extends Component {

  goBack = () => {
    this.props.dispatch(goBack())
  }

  componentWillMount() {
    const {dispatch, event} = this.props
    if (!event) return this.props.dispatch(replaceRoute(sitemap.agenda.list))
  }

  render(){
    const {event, workers, missions} = this.props
    if(!event) return null
    const styles = {
      time: {
        fontSize: '.7rem',
        fontStyle: 'italic',
        display: 'block',
        float: 'right',
      }
    }

    const mission = missions.get(event.get('missionId'))
    const worker = workers.get(event.get('workerId'))

    let missionWorkerBloc
    if(mission){
     missionWorkerBloc = (
        <div className="row">
          <div className="col-md-2">
            <TextLabel label="Type" value={event.get('type')}/>
          </div>
          <div className="col-md-4">
            <TextLabel label="Mission" value={mission && mission.get('name')}/>
          </div>
          <div className="col-md-4">
            <TextLabel label="Worker" value={worker && worker.get('name')}/>
          </div>
          <div className="col-md-2">
            <TextLabel label="Status" value={event.get('status')}/>
          </div>
        </div>
      )
    }else{
     missionWorkerBloc = (
        <div className="row">
          <div className="col-md-2">
            <TextLabel label="Type" value={event.get('type')}/>
          </div>
          <div className="col-md-8">
            <TextLabel label="Worker" value={worker && worker.get('name')}/>
          </div>
          <div className="col-md-2">
            <TextLabel label="Status" value={event.get('status')}/>
          </div>
        </div>
      )
    }

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">

            <Header obj={event}>
              <HeaderLeft>
                <GoBack goBack={this.goBack}/>
                <Title title={"View Event"}/>
              </HeaderLeft>
            </Header>

          </div>
          <div className="col-md-12 m-b"/>
          <FadeIn>
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4">
                  <DateLabel label="Start Date" date={event.get('startDate')}/>
                </div>
                <div className="col-md-4">
                  <DateLabel label="End Date" date={event.get('endDate')}/>
                </div>
                <div className="col-md-2">
                  <TextLabel label="Unit" value={event.get('unit')}/>
                </div>
                <div className="col-md-2">
                  <TextLabel label="Value" value={event.get('value')}/>
                </div>
              </div>
              {missionWorkerBloc}
              <div className="row">
                <div className="col-md-12">
                  <MarkdownText label="Description" value={event.get('description')}/>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Content>
    )
  }
}

View.propTypes = {
  event: PropTypes.object,
  missions: PropTypes.object.isRequired,
  workers: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}
export const ViewEventApp = connect(viewEventSelector)(View)
