import React, {Component} from 'react';
import Reflux from 'reflux';
import Immutable from 'immutable';
import {Content} from '../layout';
import {missionsActions} from '../../models/missions';
import {missionsAppStore,  missionsAppActions, sortMenu} from '../../models/missions-app';
import {personsStore,  personsActions} from '../../models/persons';
import {companiesStore,  companiesActions} from '../../models/companies';
import {AddButton, Preview, Closed, Edit, Delete} from './widgets';
import {Sort, Filter, Refresh, Header, HeaderLeft, HeaderRight, Title} from '../widgets';

export default class ListMissionApp extends Component {
  state = {
    persons: Immutable.Map(),
    companies: Immutable.Map(),
  };

  componentWillMount() {
    this.unsubscribeMissions = missionsAppStore.listen( state => {
      this.setState({missions: state});
    });
    missionsAppActions.load();
  }

  componentWillUnmount(){
    this.unsubscribeMissions();
  }

  handleRefresh = () => {
    missionsAppActions.load({forceReload: true});
  }

  handleSort = (mode) => {
    missionsAppActions.sort(mode)
  }

  handleSearchFilter = (filter) => {
    missionsAppActions.filter(filter);
  }

  handleResetFilter = (filter) => {
    missionsAppActions.filter("");
  }

  render(){
    if(!this.state.missions) return false;
    const leftIcon = this.state.missions.isLoading ? <i className="fa fa-spinner fa-spin m-r-1"/> : <i className="fa fa-shopping-cart m-r-1"/>;
    const missions = this.state.missions.data;
    const companies = this.state.missions.companies;
    const persons = this.state.missions.persons;
    return (
      <Content>
        <Header>
          <HeaderLeft>
            {leftIcon}
            <Title title='Missions'/>
          </HeaderLeft>
          <HeaderRight>
            <Filter filter={this.state.missions.filter} onReset={this.handleResetFilter} onChange={this.handleSearchFilter}/>
            <Sort sortMenu={sortMenu} sortCond={this.state.missions.sort} onClick={this.handleSort}/>
            <Refresh onClick={this.handleRefresh}/>
          </HeaderRight>
        </Header>

        <List 
          missions={missions} 
          persons={persons} 
          companies={companies} />

        <AddButton title='Add a Mission'/>
      </Content>
    )
  }
}

class List extends Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props.missions !== nextProps.missions 
      || this.props.companies !== nextProps.companies;
      //|| this.props.persons !== nextProps.persons;
  }

  render(){
    if(!this.props.missions.size) return false;

    const styles={
      container:{
        marginTop: '50px',
        marginBottom: '50px',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      item:{
        height: '80px',
      }
    }

    const data = this.props.missions.map(mission => {
      return (
        <div key={mission.get('_id')} className="col-md-6 tm list-item" style={styles.item}> 
          <Preview
            mission={mission} 
            company={this.props.companies.get(mission.get('clientId'))}
            manager={this.props.persons.get(mission.get('managerId'))} >
              <Closed mission={mission}/>
              <Edit mission={mission}/>
              <Delete mission={mission}/>
          </Preview>
        </div>
      )
    });

    return (
      <div className="row" style={styles.container}>
        {data}
      </div>
    )
  }

}

