import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import {Content } from '../layout';
import {Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, TextLabel, Labels, MarkdownText} from '../widgets';
import {Edit as EditPerson, Preview as PersonPreview} from '../person/widgets';
import {Edit as EditCompany, Preview as CompanyPreview} from '../company/widgets';
import {Edit, Delete} from './widgets';
import {missionsStore, missionsActions} from '../../models/missions';
import {personsStore, personsActions} from '../../models/persons';
import {companiesActions, companiesStore} from '../../models/companies';
import {navStore, navActions} from '../../models/nav';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import sitemap from '../../routes';

export default class ViewMissionApp extends Component {
  state = {};

  componentWillMount() {
    let missionId = this.props.location.state && this.props.location.state.missionId;

    this.unsubcribePersons = personsStore.listen( persons => {
      this.setState({ persons: persons.data })
    });

    this.unsubcribeCompanies = companiesStore.listen( companies => {
      this.setState({ companies: companies.data })
    });

    this.unsubcribeMissions = missionsStore.listen( missions => {
      const mission = missions.data.get(missionId);
      if(mission)this.setState({mission});
      else navActions.replace(sitemap.mission.list);
    });

    personsActions.load();
    companiesActions.load();

    if(missionId) missionsActions.load({ids: [missionId]});
    else navActions.replace(sitemap.mission.list);
  }

  componentWillUnmount(){
    this.unsubcribeCompanies();
    this.unsubcribePersons();
    this.unsubcribeMissions();
  }

  goBack = () => {
    navActions.goBack();
  }

  render(){
    if( !this.state.mission || !this.state.persons || !this.state.companies) return false;
    const mission = this.state.mission;
    const client = this.state.companies.get(mission.get("clientId"));
    const manager = this.state.persons.get(mission.get("managerId"));
    const workers = _.map(mission.get('workerIds').toJS(), id =>  this.state.persons.get(id));

    return (
      <Content>
        <Header obj={mission}>
          <HeaderLeft>
            <GoBack goBack={this.goBack}/>
            <AvatarView obj={client}/>
            <Title title={mission.get('name')}/>
          </HeaderLeft>
          <HeaderRight>
            <Edit mission={mission}/>
            <Delete mission={mission} postAction={this.goBack}/>
          </HeaderRight>
        </Header>
        <Card 
          mission={this.state.mission} 
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

  const note = () => {
    const data = mission.get('note');
    if(!data) return <div/>;
    return (
      <div className="col-md-12">
        <MarkdownText label="Note" value={mission.get('note')}/>
      </div>
    )
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
        <Client label="Client" client={client}/>
      </div>
      <div className="col-md-6 ">
        <Manager label="Manager" manager={manager}/>
      </div>
      {note()}
      <div className="col-md-12">
        <Workers 
          label="Workers" 
          workers={workers} 
          mission={mission}/>
      </div>
    </div>
  )
}

const Date = ({label, date}) => {
  return (
    <fieldset className="form-group">
      <label> {label} </label>
      <DateTimePicker
        value={date}
        time={false}
        readOnly={true}
        />
    </fieldset>
  )
}

const Client = ({label, client}) => {
 const styles={
    container:{
      marginBottom: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    item:{
      height: '80px',
    }
  };

  return (
    <fieldset className="form-group">
      <label> {label} </label>
      <div className="row" style={styles.container}>
        <div className="col-md-12 tm list-item" style={styles.item}> 
          <CompanyPreview company={client}>
            <EditCompany person={client}/>
          </CompanyPreview>
        </div>
      </div>
    </fieldset>
  )
}

const Manager = ({label, manager}) => {
 const styles={
    container:{
      marginBottom: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    item:{
      height: '80px',
    }
  };

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
      marginBottom: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    item:{
      height: '80px',
    }
  };

  const className = workers.length > 1 ? "col-md-6 tm list-item" : "col-md-12 tm list-item";
  const data = _.chain(workers)
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


