import React, {PropTypes, Component, Text, View, ListView, TouchableHighlight} from 'react-native'
const Touch = TouchableHighlight

export const Error = ({children}) => {
  return (<Text style={{color: "red"}}>{children}</Text>)
}
Error.propTypes = {
  children: PropTypes.string,
}

export const ConsoleWarn = (props) => {
  console.warn(props.children)
  return (<View/>)
}

export const ConsoleLog = (props) => {
  console.log(props.children)
  return (<View/>)
}


export class List extends Component {
  componentWillMount(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.setState({
      dataSource: ds.cloneWithRows(this.props.entities)
    })
  }

  render(){
    const styles = listStyles
    return (
      <View style={styles.list}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={x => {
            return (
              <Touch underlayColor="white" style={{}}>
                <View style={styles.element}>
                  <Text style={styles.text}>{this.props.toString(x)}</Text>
                </View>
              </Touch>
            )}}
            />
        </View>
      )
  }
}

List.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  toString: PropTypes.func.isRequired
}

const listStyles = {
    list: {
      flex: 0.9,
    },
    element: {
      alignItems: "center",
      paddingTop: 22,
      paddingBottom: 22,
      borderBottomWidth: 1,
    },
    text: {
      color: "rgb(42, 42, 42)",
      fontSize: 32,
    }
}
