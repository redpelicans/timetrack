import _ from 'lodash';
import moment from 'moment';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import {Content} from '../../components/layout';
import {Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, TextLabel, Labels, MarkdownText} from '../../components/widgets';
import {Edit as EditPerson, Preview as PersonPreview} from '../../components/person/widgets';
import {Edit as EditCompany, Preview as CompanyPreview} from '../../components/company/widgets';
import {Edit, Delete, OpenClose} from '../../components/mission/widgets';
import {missionsActions} from '../../actions/missions';
import {personsActions} from '../../actions/persons';
import {companiesActions} from '../../actions/companies';
import {replace, goBack} from '../../actions/routes'
import sitemap from '../../routes';
import Notes from '../../containers/notes';
import {viewMissionSelector} from '../../selectors/missions'

class ViewMission extends Component {

  goBack = () => {
    this.props.dispatch(goBack())
  }

  componentWillMount() {
    const {dispatch, mission} = this.props
    if(!mission) { dispatch(replace(sitemap.mission.list)) ; return }

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
            <AvatarView obj={client}/>
            <Title title={mission.get('name')}/>
          </HeaderLeft>
          <HeaderRight>
            <Edit mission={mission}/>
            <OpenClose mission={mission}/>
            <Delete mission={mission} postAction={this.goBack}/>
          </HeaderRight>
        </Header>
        <Card 
          mission={mission} 
          client={client}
          manager={manager}
          workers={workers}  />
      </Content>
    )
  }
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
        <Date label="Start Date" date={mission.get("startDate")}/>
      </div>
      <div className="col-md-2 "/>
      <div className="col-md-3 ">
        <Date label="End Date" date={mission.get("endDate")}/>
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

const Date = ({label, date}) => {
  return (
    <fieldset className="form-group">
      <label> {label} </label>
      <DateTimePicker
        defaultValue={date}
        time={false}
        readOnly={true}
        />
    </fieldset>
  )
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

  const className = workers.size > 1 ? "col-md-6 tm list-item" : "col-md-12 tm list-item";
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

export default connect(viewMissionSelector)(ViewMission)
