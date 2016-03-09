import NavBar from './navbar'

const menuItems = [
  {
    name: "companies",
    title: "Companies",
    onPress: (router) => {
      router.replace( {name: "companies"} )
    }
  },
  {
    name: "people",
    title: "People",
    onPress: (router) => {
      router.replace({name: "people"})
    }
  },
    {
      name: "missions",
      title: "Missions",
      onPress: (router) => {
        router.replace({name: "missions"})
    }
  },
]

export const Menu = (props) => {
  return (
    <NavBar items={menuItems} />
  )
}
