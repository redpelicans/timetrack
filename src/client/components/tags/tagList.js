import React, {PropTypes} from 'react'
import _ from 'lodash'

const TagItem = ({tag, onDetail}) => {
  const styles = {
    tagContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: '1',
      margin: '5px 5px 5px 5px',
      fontFamily: 'Roboto, Helvetica Neue, Helvetica, Arial, sans-serif',
      fontSize: '24px',
    },
    button: {
      backgroundColor: 'transparent',
      border: 'none',
    },
    name: {
      margin: '0px 10px 0px 0px',
      color: '#999',
    },
    occurrences: {
      margin: '0px 0px 0px 10px',
      color: '#337ab7',
    },
  }

  const handleDetails = (e) => {
    e.preventDefault()
    onDetail(tag[0])
  }
  return (
    <div style={styles.tagContainer}>
      <button style={styles.button} onClick={handleDetails}>
        <div style={styles.name}>{tag[0]}</div>
        <div style={styles.occurrences}>{tag[1]}</div>
      </button>
    </div>
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
