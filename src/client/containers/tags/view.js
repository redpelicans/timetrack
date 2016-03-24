import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {pushRoute} from '../../actions/routes'

import routes from '../../routes'
import {routeActions} from '../../actions/routes'
import {viewTagSelector} from '../../selectors/tags'
import {personsActions} from '../../actions/persons'
import {companiesActions} from '../../actions/companies'
import {Content} from '../../components/layout'
import Entities from '../../components/tags/entities'
import {Header, HeaderLeft, GoBack, HeaderRight, Title, TitleIcon, Filter} from '../../components/widgets';

class ViewTagApp extends Component {

  componentWillMount() {
    const {dispatch} = this.props
    dispatch(personsActions.load())
    dispatch(companiesActions.load())
  }

  goBack = () => {
    this.props.dispatch(routeActions.goBack())
  }

  render() {
    const {label, tag, isLoading, companies, persons} = this.props
    return (
      <Content>
        <Header>
          <HeaderLeft>
            <GoBack goBack={this.goBack} isLoading={isLoading}/>
            <Title title={label}/>
          </HeaderLeft>
        </Header>
        <Entities tag={tag} companies={companies} persons={persons} />
      </Content>
    )
  }
}

ViewTagApp.propTypes = {
  label: PropTypes.string,
  tag: PropTypes.array.isRequired,
  companies: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
}

export default connect(viewTagSelector)(ViewTagApp)
