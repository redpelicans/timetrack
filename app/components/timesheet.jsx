import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import ClientStore from '../stores/client';
import ClientActions from '../actions/client';
//import {componentHandler} from 'google/material-design-lite';


export class TimesheetApp extends Component {

  componentDidMount() {
    console.log('update')
    componentHandler.upgradeDom();
  }

  render() {
    return (
    <div> 
     <div className="mdl-grid"> 

        <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
          Button
        </button>

        <div ref="search" className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="sample6">
            <i className="material-icons">search</i>
          </label>
          <div className="mdl-textfield__expandable-holder">
            <input className="mdl-textfield__input" type="text" id="sample6" />
            <label className="mdl-textfield__label" htmlFor="sample-expandable" >Expandable Input</label>
          </div>
        </div>
      </div>


     <div className="mdl-grid"> 
        <button id="demo-menu-lower-left" className="mdl-button mdl-js-button mdl-button--icon">
          <i className="material-icons">more_vert</i>
        </button>
        <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" htmlFor="demo-menu-lower-left">
          <li className="mdl-menu__item">Some Action</li>
          <li className="mdl-menu__item">Another Action</li>
          <li disabled className="mdl-menu__item">Disabled Action</li>
          <li className="mdl-menu__item">Yet Another Action</li>
        </ul>
      </div>


     <div className="mdl-grid"> 
      <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
        <thead>
          <tr>
            <th className="mdl-data-table__cell--non-numeric">Material</th>
            <th>Quantity</th>
            <th>Unit price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
            <td>25</td>
            <td>$2.90</td>
          </tr>
          <tr>
            <td className="mdl-data-table__cell--non-numeric">Plywood (Birch)</td>
            <td>50</td>
            <td>$1.25</td>
          </tr>
          <tr>
            <td className="mdl-data-table__cell--non-numeric">Laminate (Gold on Blue)</td>
            <td>10</td>
            <td>$2.35</td>
          </tr>
        </tbody>
      </table>
      </div>

      </div>
    );
  }

}

