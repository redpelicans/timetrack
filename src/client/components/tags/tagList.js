import React, {PropTypes} from 'react'
import _ from 'lodash'

const TagItem = ({tag, onDetail}) => {
  const styles = {
    tagContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: '1',
      margin: '0px 10px',
      padding: '10px 5px',
      fontFamily: 'Roboto, Helvetica Neue, Helvetica, Arial, sans-serif',
      fontSize: '24px',
      backgroundColor: 'transparent',
      border: 'none',
    },
    name: {
      margin: '0px 5px 0px 0px',
      color: '#999',
    },
    occurrences: {
      margin: '0px 0px 0px 5px',
      color: '#337ab7',
    },
  }

  const handleDetails = (e) => {
    e.preventDefault()
    onDetail(tag[0])
  }
    //<div style={styles.tagContainer}>
  return (
      <button style={styles.tagContainer} onClick={handleDetails}>
        <div style={styles.name}>{tag[0]}</div>
        <div style={styles.occurrences}>{tag[1]}</div>
      </button>
  )
}

let i = 0

const TagList = ({tagList, onDetail}) => {
  const styles = {
    tagListContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap'
    }
  }
  const list = _.map(tagList, (tag) => {
    return (
      <TagItem tag={tag} key={i++} onDetail={onDetail} />
    )
  })
  return (
    <div style={styles.tagListContainer}>{list}</div>
  )
}

TagItem.propTypes = {
  tag: PropTypes.array.isRequired,
  onDetail: PropTypes.func.isRequired,
}

TagList.propTypes = {
  tagList: PropTypes.array.isRequired,
  onDetail: PropTypes.func.isRequired,
}

export default TagList
