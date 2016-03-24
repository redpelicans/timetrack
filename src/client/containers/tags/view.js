import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {pushRoute} from '../../actions/routes'

import routes from '../../routes'
import {tagListSelector} from '../../selectors/tags'
import {personsActions} from '../../actions/persons'
import {companiesActions} from '../../actions/companies'
import {Content} from '../../components/layout'
import Entities from '../../components/tags/entities'
import {Header, HeaderLeft, HeaderRight, Title, TitleIcon, Filter} from '../../components/widgets';
class ViewTagApp extends Component {

  componentWillMount() {
    const {dispatch} = this.props
    dispatch(personsActions.load())
    dispatch(companiesActions.load())
  }

  render() {
    const {label, tag} = this.props
    console.log('tag dans container VIEW = ', tag)
    return (
      <Content>
        <Header>
          <HeaderLeft>
            <Title title={label}/>
          </HeaderLeft>
        </Header>
        <Entities label={label} tag={tag}/>
      </Content>
    )
  }
}

export default connect(tagListSelector)(ViewTagApp)
//<div>Welcome to Tag view page, label is {label}</div>
