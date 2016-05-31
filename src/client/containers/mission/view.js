import _ from 'lodash';
import moment from 'moment';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import {Content} from '../../components/layout';
import {FadeIn, Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, TextLabel, DateLabel, Labels, MarkdownText, IconButton} from '../../components/widgets';
import {Edit as EditPerson, Preview as PersonPreview} from '../../components/person/widgets';
import {Edit as EditCompany, Preview as CompanyPreview} from '../../components/company/widgets';
import {Edit, Delete, OpenClose} from '../../components/mission/widgets';
import {missionsActions} from '../../actions/missions';
import {personsActions} from '../../actions/persons';
import {companiesActions} from '../../actions/companies';
import {agendaActions} from '../../actions/agenda';
import {replaceRoute, goBack} from '../../actions/routes'
import sitemap from '../../routes';
import Notes from '../../containers/notes';
import {viewMissionSelector} from '../../selectors/missions'
import routes from '../../routes';
import {pushRoute} from '../../actions/routes';

class ViewMission extends Component {

  goBack = () => {
    this.props.dispatch(goBack())
  }

  handleClick = () => {
    this.props.dispatch(agendaActions.changeFilter({missionIds: [this.props.mission.get('_id')], workerIds: []}))
    this.props.dispatch(pushRoute(routes.agenda.view))
  }

  componentWillMount() {
    const {dispatch, mission} = this.props
    if(!mission) { dispatch(replaceRoute(sitemap.mission.list)) ; return }

    dispatch(missionsActions.load({ids: [mission.get('_id')]}))
    dispatch(companiesActions.load({ids: [mission.get('clientId')]}))
    dispatch(personsActions.load({
      ids: [mission.get('managerId'), ...mission.get('workerIds').toArray()]
    }))
  }

  render(){
    const {mission, client, manager, workers, isLoading} = this.props
    if (!mission) return false

    return (
      <Content>
        <Header obj={mission}>
          <HeaderLeft>
            <GoBack goBack={this.goBack} isLoading={isLoading}/>
            <AvatarView style={{paddingRight: '10px'}} obj={client}/>
            <Title title={mission.get('name')}/>
          </HeaderLeft>
          <HeaderRight>
            <div className="m-r-1"><Edit mission={mission}/></div>
            <div className="m-r-1"><OpenClose mission={mission}/></div>
            <div className="m-r-1"><Delete mission={mission} postAction={this.goBack}/></div>
          </HeaderRight>
        </Header>
        <FadeIn>
          <Card
            mission={mission}
            client={client}
            manager={manager}
            workers={workers}  />
        </FadeIn>
      </Content>
    )
  }
}

ViewMission.propTypes = {
  mission:     PropTypes.object,
  client:      PropTypes.object,
  manager:     PropTypes.object,
  workers:     PropTypes.object,
  isLoading:   PropTypes.bool,
  dispatch:    PropTypes.func.isRequired

}

const Card = ({mission, client, manager, workers}) =>  {

  const styles={
    container:{
      marginTop: '3rem',
    },
  }

  return (
    <div style={styles.container} className="row" >

      <div className="col-md-2 "/>
      <div className="col-md-3 ">
        <DateLabel label="Start Date" date={mission.get('startDate')}/>
      </div>
      <div className="col-md-2 "/>
      <div className="col-md-3 ">
        <DateLabel label="End Date" date={mission.get('endDate')}/>
      </div>
      <div className="col-md-2 "/>
      <div className="col-md-6 ">
        <Client label="Client" workers={workers} client={client}/>
      </div>
      <div className="col-md-6 ">
        <Manager label="Manager" manager={manager}/>
      </div>
      <div className="col-md-12">
        <Workers
          label="Workers"
          workers={workers}
          mission={mission}/>
      </div>
      <div className="col-md-12">
        <Notes entity={mission}/>
      </div>
    </div>
  )
}

Card.propTypes = {
  mission:     PropTypes.object.isRequired,
  client:      PropTypes.object.isRequired,
  manager:     PropTypes.object.isRequired,
  workers:     PropTypes.object.isRequired,
}

const Client = ({label, client, workers}) => {
 const styles={
    container:{
      //marginBottom: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    item:{
      height: '80px',
    }
  };

  if(!client)return <div/>;
  return (
    <fieldset className="form-group">
      <label> {label} </label>
      <div className="row" style={styles.container}>
        <div className="col-md-12 tm list-item" style={styles.item}>
          <CompanyPreview workers={workers} company={client}>
            <EditCompany company={client}/>
          </CompanyPreview>
        </div>
      </div>
    </fieldset>
  )
}

Client.propTypes = {
  label:    PropTypes.string.isRequired,
  client:   PropTypes.object.isRequired,
  workers:  PropTypes.object.isRequired
}

const Manager = ({label, manager}) => {
 const styles={
    container:{
      //marginBottom: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    item:{
      height: '80px',
    }
  };

  if(!manager)return <div/>;
  return (
    <fieldset className="form-group">
      <label> {label} </label>
      <div className="row" style={styles.container}>
        <div className="col-md-12 tm list-item" style={styles.item}>
          <PersonPreview person={manager}>
            <EditPerson person={manager}/>
          </PersonPreview>
        </div>
      </div>
    </fieldset>
  )

}

Manager.propTypes = {
  label:    PropTypes.string.isRequired,
  manager:  PropTypes.object.isRequired
}

const Workers = ({label, workers, mission}) => {
 const styles={
    container:{
      //marginBottom: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    item:{
      height: '80px',
    }
  };

  const className = workers.size > 1 ? 'col-md-6 tm list-item' : 'col-md-12 tm list-item';
  const data = _.chain(workers.toArray())
    .sortBy( person => person.get('name') )
    .map( person => {
      return (
        <div key={person.get('_id')} className={className} style={styles.item}>
          <PersonPreview person={person}>
            <EditPerson person={person}/>
          </PersonPreview>
        </div>
        )
      })
    .value();

  if(!data.length) return <div/>;

  return (
    <fieldset className="form-group">
      <label> {label} </label>
      <div className="row" style={styles.container}>
        {data}
      </div>
    </fieldset>
  )
}

Workers.propTypes = {
  label:    PropTypes.string.isRequired,
  mission:  PropTypes.object.isRequired,
  workers:  PropTypes.object.isRequired
}

export default connect(viewMissionSelector)(ViewMission)
