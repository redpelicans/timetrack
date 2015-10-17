import React, {Component} from 'react';
import Header from './header';
import MainButtonMenu from './main_button_menu';
import DateTimeField from 'react-bootstrap-datetimepicker';

export default class HomeApp extends Component{
  static contextTypes = {
    toggleSideBar: React.PropTypes.func.isRequired
  }

  componentDidMount(){
  }

  render(){
    let buttonMenu = (
      <MainButtonMenu onClick={this.context.toggleSideBar}/>
    )

    return (
      <div>
        <Header title={'Timetrack by Redpelicans'} buttonMenu={buttonMenu}/>
        <div className="content">
          <h1>Home Sweet Home ...</h1>
          <button type="button" className="btn btn-primary">Primary</button>
          <div className="dropdown">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              Dropdown
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a href="#">Action</a></li>
              <li><a href="#">Another action</a></li>
              <li><a href="#">Something else here</a></li>
              <li><a href="#">Separated link</a></li>
            </ul>
          </div>
          <div className="btn-group" data-toggle="buttons">
            <label className="btn btn-primary active">
              <input type="checkbox" autocomplete="off" checked /> Checkbox 1 (pre-checked)
            </label>
            <label className="btn btn-primary">
              <input type="checkbox" autocomplete="off" /> Checkbox 2
            </label>
            <label className="btn btn-primary">
              <input type="checkbox" autocomplete="off" /> Checkbox 3
            </label>
          </div>
        </div>
        <DateTimeField />
        <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
          Launch demo modal
        </button>
        <div className="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title" id="myModalLabel">Modal title</h4>
              </div>
              <div className="modal-body">
                <div className="btn-group" data-toggle="buttons">
                  <label className="btn btn-primary active">
                    <input type="checkbox" autocomplete="off" checked /> Checkbox 1 (pre-checked)
                  </label>
                  <label className="btn btn-primary">
                    <input type="checkbox" autocomplete="off" /> Checkbox 2
                  </label>
                  <label className="btn btn-primary">
                    <input type="checkbox" autocomplete="off" /> Checkbox 3
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


}

