import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import {Content} from '../../components/layout';
import {Sort, FilterPreferred, Filter, Refresh, Header, HeaderLeft, HeaderRight, Title, TitleIcon} from '../../components/widgets';
import {AddButton, Preferred, Preview, Edit, Delete} from '../../components/person/widgets';
import {personsActions} from '../../actions/persons';
import {companiesActions} from '../../actions/companies';
import {visiblePersonsSelector} from '../../selectors/persons.js'
import routes from '../../routes';
import Masonry from 'react-masonry-component'

const sortMenu = [
  {key: 'name', label: 'Sort Alphabeticaly'},
  {key: 'createdAt', label: 'Sort by creation date'},
  {key: 'updatedAt', label: 'Sort by updated date'},
];

class PersonList extends Component {

  componentWillMount() {
    this.props.dispatch(personsActions.load())
    this.props.dispatch(companiesActions.load())
  }

  handleRefresh = () => {
    this.props.dispatch(personsActions.load({forceReload: true}))
  }

  handlePreferred = () => {
    const {filterPreferred, dispatch, persons} = this.props
    dispatch(personsActions.togglePreferredFilter())
  }

  handleSort = (mode) => {
    this.props.dispatch(personsActions.sort(mode))
  }

  handleSearchFilter = (filter) => {
    this.props.dispatch(personsActions.filter(filter))
  }

  handleResetFilter = (filter) => {
    this.props.dispatch(personsActions.filter(""))
  }

  render(){
    const {persons, companies, filter, filterPreferred, sortCond, isLoading} = this.props
    return (
      <Content>
        <Header>
          <HeaderLeft>
            <TitleIcon isLoading={isLoading} icon={routes.person.list.iconName}/>
            <Title title='People'/>
          </HeaderLeft>
          <HeaderRight>
            <Filter filter={filter} onReset={this.handleResetFilter} onChange={this.handleSearchFilter}/>
            <Sort sortMenu={sortMenu} sortCond={sortCond} onClick={this.handleSort}/>
            <FilterPreferred preferred={filterPreferred} onClick={this.handlePreferred}/>
            <Refresh onClick={this.handleRefresh}/>
          </HeaderRight>
        </Header>
        <List persons={persons} companies={companies} />
        <AddButton title='Add a Contact'/>
      </Content>
    )
  }

}

PersonList.propTypes = {
  persons:          PropTypes.object.isRequired,
  companies:        PropTypes.object.isRequired,
  filter:           PropTypes.string,
  filterPreferred:  PropTypes.bool,
  sortCond:         PropTypes.object.isRequired,
  isLoading:        PropTypes.bool,
  dispatch:         PropTypes.func.isRequired,
}

const List = ({persons, companies}) => {
  if(!persons || !companies) return false;

  const styles={
    container: {
      marginTop: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    item: {
      padding: '12px'
      //height: '80px',
    }
  }

  const data = persons.map((person, i) => {
    return (
      <div key={i} className="tm list-item x-list-item" style={styles.item}>
        <Preview
          person={person}
          company={companies.get(person.get('companyId'))} >
            <Edit person={person}/>
            <Delete person={person}/>
        </Preview>
      </div>
    )
  });

const options = {
  transitionDuration: 0,
}
  return (
    <Masonry style={styles.container} options={options}>
      {data}
    </Masonry>
  )
}

List.propTypes = {
  persons:    PropTypes.object.isRequired,
  companies:  PropTypes.object.isRequired
}

export default connect(visiblePersonsSelector)(PersonList);
