import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import CompanyStore from '../company/store';
import CompanyActions from '../company/actions';


export default class MissionApp extends Component {

  componentDidMount() {
    console.log('update')
    componentHandler.upgradeDom();
  }

  render() {
    return (
    <div> 
     <div className="mdl-grid"> 
      <div className="mdl-cell mdl-cell--12-col"> 

        <div className="mdl-layout mdl-js-layoutXX mdl-layout--fixed-drawerXX mdl-layout--fixed-headerXX">
          <header className="mdl-layout__header">
            <div className="mdl-layout__header-row">
              <div className="mdl-layout-spacer"></div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
                <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="fixed-header-drawer-exp">
                  <i className="material-icons">search</i>
                </label>
                <div className="mdl-textfield__expandable-holder">
                  <input className="mdl-textfield__input" type="text" name="sample" id="fixed-header-drawer-exp" />
                </div>
              </div>
            </div>
          </header>
          <div className="mdl-layout__drawer">
            <span className="mdl-layout-title">Title</span>
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link" href="">Link</a>
              <a className="mdl-navigation__link" href="">Link</a>
              <a className="mdl-navigation__link" href="">Link</a>
              <a className="mdl-navigation__link" href="">Link</a>
            </nav>
          </div>
          <main className="mdl-layout__content">
            <div className="page-content">Your content goes here</div>
          </main>
        </div>

      </div>
     </div>
    </div>
    );
  }

}

