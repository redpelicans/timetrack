/* @flow */
import React, {Component, PropTypes, Text, View, TouchableHighlight} from 'react-native'
import {ConsoleWarn} from './widgets'

const Touch = TouchableHighlight

class NavBar extends Component {
  componentWillMount() {
    if (!this.props.route || !this.props.router) return
    this.setState({items : this.props.items.map((x, i) => {
      return {
        id: i,
        ...x,
        selected: (x.name === this.props.route.name) ? (true) : (false),
        onPress: () => {
          const selected = this.state.items[i].selected
          this.setState({items: this.state.items.map(y => {
            return (i === y.id) ? ({...y, selected: true}) : ({...y, selected: false})
          })})
          if (!selected && x.onPress) x.onPress(this.props.router)
        }
      }
    })})
  }

  render() {
    if (!this.props.route || !this.props.router)
      return <ConsoleWarn>NavBar Error: must be a child Router</ConsoleWarn>
    const elements = this.state.items.map(x => {
      return (
        <Touch key={x.id} onPress={x.onPress}>
          <View style={((x.selected) ? (styles.selectedElement) : (styles.element))}>
            <Text style={styles.text}>{x.title}</Text>
          </View>
        </Touch>
      )
    })

    return (
      <View style={styles.navbar}>
        {elements}
      </View>
    )
  }
}

NavBar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name:     PropTypes.string.isRequired,
    title:    PropTypes.string,
    onPress:  PropTypes.func,
  })).isRequired,
}

export default NavBar

const styles = {
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 0.1,
    backgroundColor: 'black',
  },
  element: {
    padding: 22,
  },
  selectedElement: {
    backgroundColor: 'rgb(42, 42, 42)',
    padding: 22,
  },
  text: {
    fontSize: 16,
    color: "white",
  }
}
