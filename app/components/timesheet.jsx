import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import MissionActions from '../actions/mission';
import MissionStore from '../stores/mission';
import moment from 'moment';
import _ from 'lodash';

export default class TimesheetApp extends Component {
  componentWillMount() {
    MissionActions.fetch();
  }

  componentDidMount() {
    componentHandler.upgradeDom();
  }

  render() {
    return (
      <AltContainer store={MissionStore}>
        <TimesheetContainer />
      </AltContainer>
    );
  }
}

class TimesheetContainer extends Component {
  navigateToPreviousWeek = () => {
    MissionActions.navigateToPreviousWeek();
  }

  navigateToNextWeek = () => {
    MissionActions.navigateToNextWeek();
  }

  render() {
    if (this.props.isFetching) return <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>;

    let styles = {
      card: {
        width: '100%'
      }
    };
    
    return (
      <div className="mdl-grid">
        <div className="mdl-card mdl-shadow--2dp" style={styles.card}>
          <TimesheetNavigationView
            {...this.props}
            navigateToPreviousWeek={this.navigateToPreviousWeek}
            navigateToNextWeek={this.navigateToNextWeek}
          />
          <div className="mdl-card__media">
            <TimesheetTableView {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

class TimesheetNavigationView extends Component {
  render() {
    let styles = {
      title: {
        width: '150px',
        textAlign: 'center'
      }
    };
    return (
      <div className="mdl-card__title">
        <button className="mdl-button mdl-js-button mdl-button--icon" onClick={this.props.navigateToPreviousWeek}>
          <i className="material-icons">chevron_left</i>
        </button>
        <span style={styles.title}>
          {
            `${moment(this.props.currentDate).startOf('w').format('MMM DD')}
            - 
            ${moment(this.props.currentDate).endOf('w').format('DD, YYYY')}`
          }
        </span>
        <button className="mdl-button mdl-js-button mdl-button--icon" onClick={this.props.navigateToNextWeek}>
          <i className="material-icons">chevron_right</i>
        </button>
      </div>
    );
  }
}

class TimesheetTableView extends Component {
  render() {
    let styles = {
      table: {
        border: 'none',
        width: '100%'
      }
    };

    return (
      <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable" style={styles.table}>
        <TimesheetHeaderView {...this.props} />
        <TimesheetBodyView {...this.props} />
      </table>
    );
  }
}

class TimesheetHeaderView extends Component {
  render() {
    let dayOfWeek = moment(this.props.currentDate).startOf('w');
    
    return (
      <thead>
        <th className="mdl-data-table__cell--non-numeric"></th>
        {_.times(7, n => {
          return (
            <th key={n} className="mdl-data-table__cell--non-numeric">
              {dayOfWeek.add(n == 0 ? n : 1, 'd').format('ddd D')}
            </th>
          );
        })}
      </thead>
    );
  }
}

class TimesheetBodyView extends Component {
  render() {
    return (
      <tbody>
        {this.props.missions.map(mission => {
          let dayOfWeek = moment(this.props.currentDate).startOf('w');
          return (
            <tr key={mission.id}>
              <td className="mdl-data-table__cell--non-numeric">{`${mission.company.label}:${mission.label}`}</td>
              {_.times(7, n => {
                let workBlock = _.find(mission.workBlocks, workBlock => {
                  let startTime = moment(dayOfWeek).startOf('d');
                  let endTime = moment(startTime).add(1, 'd');
                  return moment(workBlock.startTime).isBetween(startTime, endTime);
                });
                dayOfWeek.add(1, 'd');
                return (
                  <td key={n} className="mdl-data-table__cell--non-numeric">
                    {workBlock ? workBlock.quantity : ''}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  }
}
