import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import routes from '../../routes';
import {authable} from '../../components/authmanager';
import {pushRoute} from '../../actions/routes';
import {notesActions} from '../../actions/notes';
import ReactTooltip from 'react-tooltip';

@authable
export class AddButton extends Component {

  handleClick = () => {
    this.context.dispatch(pushRoute(routes.notes.new));
  }

  render(){
    const {authManager} = this.context;
    const style = {
        position: 'fixed',
        display: 'block',
        right: 0,
        bottom: 0,
        marginRight: '30px',
        marginBottom: '30px',
        zIndex: '900',
    }

    const {title} = this.props

    if(!authManager.notes.isAuthorized('new')){
      return <div/>
    } else {
      return (
        <div>
          <button id="addObject" type="button" className="btn-primary btn" data-tip={title} data-for="addNote" style={style} onClick={this.handleClick}>
            <i className="fa fa-plus"/>
          </button>
          <ReactTooltip id="addNote" place="left" effect="solid" />
        </div>
      )
    }
  }
}

AddButton.propTypes = {
  title: PropTypes.string
}
