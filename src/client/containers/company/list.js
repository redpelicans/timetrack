import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {visibleCompaniesSelector} from '../../selectors/companies';
import {companiesActions} from '../../actions/companies';
import {missionsActions} from '../../actions/missions';
import {Content} from '../../components/layout';
import {Sort, FilterPreferred, Filter, Refresh, NewLabel, UpdatedLabel} from '../../components/widgets';
import {Header, HeaderLeft, HeaderRight, Title, TitleIcon} from '../../components/widgets';
import {Edit, Preferred, Delete, AddButton, Preview} from '../../components/company/widgets';
import routes from '../../routes';
import Masonry from 'react-masonry-component'

const sortMenu = [
  {key: 'name', label: 'Sort Alphabeticaly'},
  {key: 'billable', label: 'Sort by billable amount'},
  {key: 'billed', label: 'Sort by billed amount'},
  {key: 'createdAt', label: 'Sort by creation date'},
  {key: 'updatedAt', label: 'Sort by updated date'},
];

class CompanyList extends Component{

  componentWillMount(){
    this.props.dispatch(companiesActions.load());
    this.props.dispatch(missionsActions.load());
  }

  handleRefresh = () => {
    this.props.dispatch(companiesActions.load({forceReload: true}));
  }

  handlePreferred = () => {
    this.props.dispatch(companiesActions.togglePreferredFilter());
  }

  handleTogglePreferred = (company) => {
    this.props.dispatch(companiesActions.togglePreferred(company));
  }

  handleSort = (mode) => {
    this.props.dispatch(companiesActions.sort(mode));
  }

  handleSearchFilter = (filter) => {
    this.props.dispatch(companiesActions.filter(filter));
  }

  handleResetFilter = (filter) => {
    this.props.dispatch(companiesActions.filter(''));
  }

  render(){
    const {companies, persons, filter, filterPreferred, sortCond, isLoading} = this.props;
    return (
      <Content>
        <Header>
          <HeaderLeft>
            <TitleIcon isLoading={isLoading} icon={routes.company.list.iconName}/>
            <Title title='Companies'/>
          </HeaderLeft>
          <HeaderRight>
            <Filter filter={filter} onReset={this.handleResetFilter} onChange={this.handleSearchFilter}/>
            <Sort sortMenu={sortMenu} sortCond={sortCond} onClick={this.handleSort}/>
            <FilterPreferred preferred={filterPreferred} onClick={this.handlePreferred}/>
            <Refresh onClick={this.handleRefresh}/>
          </HeaderRight>
        </Header>
        <List companies={companies} persons={persons}  />
        <AddButton title='Add a company'/>
      </Content>
    )
  }
}

CompanyList.propTypes = {
  companies:        PropTypes.object.isRequired,
  persons:          PropTypes.object.isRequired,
  filter:           PropTypes.string,
  filterPreferred:  PropTypes.bool,
  sortCond:         PropTypes.object.isRequired,
  isLoading:        PropTypes.bool,
  dispatch:         PropTypes.func.isRequired,
}


const List = ({companies, persons}) => {
  if(!companies) return false;

  const styles={
    container: {
      marginTop: '50px',
    },
    item: {
      margin: '0px',
      padding: '5px',
    },
    subItem: {
      height: '100%',
      minHeight: '72px',
      alignItems: 'center',
      display: 'flex',
    },
  }

  const getFilterPersonsByCompanyId = companyId => person => person.get('companyId') == companyId

  const data = companies.map((company, i) => {
    const workers = persons.filter(getFilterPersonsByCompanyId(company.get('_id')))
    return (
      <div key={i} className="x-list-item" style={styles.item}>
        <div className="form-control" style={styles.subItem}>
          <Preview workers={workers} company={company} />
        </div>
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
  companies: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
}

export default connect(visibleCompaniesSelector)(CompanyList);
