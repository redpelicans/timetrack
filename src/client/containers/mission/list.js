import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Immutable from 'immutable'
import {Content} from '../../components/layout'
import {missionsActions} from '../../actions/missions'
import {personsActions} from '../../actions/persons'
import {companiesActions} from '../../actions/companies'
import {AddButton, Preview, Closed, Edit, Delete} from '../../components/mission/widgets'
import {Sort, Filter, Refresh, Header, HeaderLeft, HeaderRight, Title, TitleIcon} from '../../components/widgets'
import routes from '../../routes'
import {visibleMissionsSelector} from '../../selectors/missions'

const sortMenu = [
  {key: 'name', label: 'Sort Alphabeticaly'},
  {key: 'createdAt', label: 'Sort by creation date'},
  {key: 'updatedAt', label: 'Sort by updated date'},
];

class MissionList extends Component {

  componentWillMount() {
    const {dispatch} = this.props

    dispatch(missionsActions.load())
    dispatch(personsActions.load())
    dispatch(companiesActions.load())
  }

  handleRefresh = () => {
    this.props.dispatch(missionsActions.load({forceReload: true}))
  }

  handleSort = (mode) => {
    this.props.dispatch(missionsActions.sort(mode))
  }

  handleSearchFilter = (filter) => {
    this.props.dispatch(missionsActions.filter(filter))
  }

  handleResetFilter = (filter) => {
    this.props.dispatch(missionsActions.filter(""))
  }

  render(){
    const {missions, persons, companies, isLoading, filter, sortCond} = this.props
    if(!missions) return false;

    return (
      <Content>
        <Header>
          <HeaderLeft>
            <TitleIcon isLoading={isLoading} icon={routes.mission.list.iconName}/>
            <Title title='Missions'/>
          </HeaderLeft>
          <HeaderRight>
            <Filter filter={filter} onReset={this.handleResetFilter} onChange={this.handleSearchFilter}/>
            <Sort sortMenu={sortMenu} sortCond={sortCond} onClick={this.handleSort}/>
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

MissionList.propTypes = {
  companies:    PropTypes.object,
  persons:      PropTypes.object,
  missions:     PropTypes.object,
  filter:       PropTypes.string,
  sortCond:     PropTypes.object.isRequired,
  dispatch:     PropTypes.func.isRequired
}

class List extends Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props.missions !== nextProps.missions 
      || this.props.companies !== nextProps.companies
      || this.props.persons !== nextProps.persons;
  }

  render(){
    if(!this.props.missions.size) return false;

    const styles={
      container:{
        marginTop: '50px',
        //marginBottom: '50px',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      item:{
        height: '80px',
      }
    }

    const data = this.props.missions.map(mission => {
      const workers = this.props.persons.filter(person => mission.get('workerIds').indexOf(person.get('_id')) !== -1);
      return (
        <div key={mission.get('_id')} className="col-md-6 tm list-item" style={styles.item}> 
          <Preview
            mission={mission} 
            workers={workers}
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

List.propTypes = {
  companies:    PropTypes.object.isRequired,
  persons:      PropTypes.object.isRequired,
  missions:     PropTypes.object.isRequired
}

export default connect(visibleMissionsSelector)(MissionList)
