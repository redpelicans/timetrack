
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {pushRoute} from '../../actions/routes'

import routes from '../../routes'
import {tagListSelector} from '../../selectors/tags'
//import {tagsActions} from '../../actions/tags'
import {Content} from '../../components/layout';
import {Header, HeaderLeft, HeaderRight, Title, TitleIcon, Filter} from '../../components/widgets';
//import TagList from '../../components/tags/tagList'

class ListTagsApp extends Component {

  componentWillMount = () => {
  //none for now
  }

  /*onDetail = (label) => {
    console.log('routes.tags.detail = ', routes.tags.detail)
    this.props.dispatch(pushRoute(routes.tags.detail, {label}))
  }*/

  render() {
    const {tagList} = this.props
    console.log('dans container Tags, tagList = ', tagList)
    return (
        <Content>
          <Header>
            <HeaderLeft>
              <TitleIcon icon={routes.tags.list.iconName} />
              <Title title='Tags' />
            </HeaderLeft>
          </Header>
          <div>Ceci est la page de tags</div>
        </Content>
    )
  }
}

export default connect(tagListSelector)(ListTagsApp)
        
          //<TagList tags={tags} onDetail={this.onDetail} />
