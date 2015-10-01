import React, {Component} from 'react'
import  {Link} from 'react-router'
import ReactDOM from 'react-dom';



class Home extends Component{
  handleValidate = () => {
    console.log("COUCOU")
  }
  render() {
    return (
      <div>
        <h3>About</h3>
        <button className="ui basic button" onClick={this.handleValidate}> 
          <i className="material-icons">keyboard_backspace</i>
        </button>
      </div>
    )
  }
}



export default Home;
