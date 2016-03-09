
import React, {
  Component,
  cloneElement,
  Navigator,
  View,
  Text,
} from 'react-native';

const ConsoleWarn = (props) => {
  console.warn(props.children)
  return (<View/>)
}

export const Route = (props) => <View {...props} />

export class Router extends Component {

  render() {
    let {children, initialRoute, initialRouteStack} = this.props

    if (this.props.renderScene !== undefined)
      return <ConsoleWarn>Router Error: renderScene props forbidden</ConsoleWarn>
    if (!children) return <ConsoleWarn>Router Error: no routes.</ConsoleWarn>
    if (!Array.isArray(children)) children = [children]

    const routes = children.filter(r => r.type === <Route/>.type)

    if (!initialRoute && !initialRouteStack) initialRoute = { name: routes[0].props.name }
    if (initialRoute) initialRouteStack = [initialRoute]

    return (
      <View style={{flex: 1}}>
        <Navigator
          {...this.props}
          initialRoute={undefined}
          initialRouteStack={initialRouteStack}
          renderScene={(route, router) => {
            if (!route) return <ConsoleWarn>Router Error: no initial route has set</ConsoleWarn>
            if (!route.name) return <ConsoleWarn>Router Error: route has no name</ConsoleWarn>

            const routeElement = children.find((x) => x.props.name === route.name)
            if (!routeElement) return <ConsoleWarn>Router Error: route name not found</ConsoleWarn>
            if (!routeElement.props.component)
              return <ConsoleWarn>Router Error: route component not found</ConsoleWarn>

            let i = 0
            return children
              .filter(x => x.type !== <Route/>.type || x.props.name === route.name)
              .map(x => (x.type === <Route/>.type) ? (
                  <x.props.component key={++i} route={{...x.props, ...route, component: undefined}} router={router} />
                ) : (cloneElement(x, {route, router, key: ++i})))
          }}
        />
      </View>
    )
  }
}
