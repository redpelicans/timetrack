
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {pushRoute} from '../../actions/routes'

import routes from '../../routes'
import {tagListSelector} from '../../selectors/tags'
//import {tagsActions} from '../../actions/tags'
import {Content} from '../../components/layout';
import {Header, HeaderLeft, HeaderRight, Title, TitleIcon, Filter} from '../../components/widgets';
import TagList from '../../components/tags/tagList'

class ListTagsApp extends Component {

  componentWillMount = () => {
  //none for now
  }

  onDetail = (label) => {
    console.log('clicked on function onDetail()')
    //console.log('routes.tags.detail = ', routes.tags.detail)
    //this.props.dispatch(pushRoute(routes.tags.detail, {label}))
  }

  render() {
    const {tagList} = this.props
    return (
        <Content>
          <Header>
            <HeaderLeft>
              <TitleIcon icon={routes.tags.list.iconName} />
              <Title title='Tags' />
            </HeaderLeft>
          </Header>
          <TagList tagList={tagList} onDetail={this.onDetail} />
        </Content>
    )
  }
}

export default connect(tagListSelector)(ListTagsApp)
