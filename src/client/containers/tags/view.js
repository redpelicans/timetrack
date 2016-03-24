import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {pushRoute} from '../../actions/routes'

import routes from '../../routes'
import {tagListSelector} from '../../selectors/tags'
//import {tagsActions} from '../../actions/tags'
import {Content} from '../../components/layout';
import {Header, HeaderLeft, HeaderRight, Title, TitleIcon, Filter} from '../../components/widgets';

class ViewTagApp extends Component {
  render() {
    const {label} = this.props
    return (
      <div>Welcome to Tag view page, label is {label}</div>
    )
  }
}

export default connect(tagListSelector)(ViewTagApp)
