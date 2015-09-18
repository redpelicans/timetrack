import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import moment from 'moment';
import _ from 'lodash';
import './style.css';
import MissionActions from '../mission/actions';
import MissionStore from '../mission/store';
import WorkblockActions from '../workblocks/actions';
import WorkblockStore from '../workblocks/store';
import TimesheetActions from './actions';
import TimesheetStore from './store';

export default class TimesheetApp extends Component {
  componentWillMount() {
    MissionActions.fetch();
    WorkblockActions.fetch();
  }

  render() {
    return (
      <AltContainer
        stores={{missionStore: MissionStore, workblockStore: WorkblockStore, timesheetStore: TimesheetStore}}
        actions={TimesheetActions}
      >
        <TimesheetContainer />
      </AltContainer>
    );
  }
}

class TimesheetContainer extends Component {
  componentDidMount() {
    componentHandler.upgradeDom();
  }

  render() {
    let styles = {
      progress: {
        width: '100%'
      },
      card: {
        width: '100%',
        minHeight: 'initial'
      }
    };
    
    if (this.props.missionStore.isFetching || this.props.workblockStore.isFetching) {
      return <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate" style={styles.progress}></div>;
    }

    return (
      <div className="mdl-grid">
        <div className="mdl-card mdl-shadow--2dp" style={styles.card}>
          <TimesheetNavigationView {...this.props} />
          <div className="mdl-card__media">
            <TimesheetTableView {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

class TimesheetNavigationView extends Component {
  componentDidMount() {
    componentHandler.upgradeDom();
  }

  render() {
    let styles = {
      title: {
        width: '150px',
        textAlign: 'center',
        lineHeight: '32px'
      }
    };
    return (
      <div className="mdl-card__title">
        <button className="mdl-button mdl-js-button" onClick={this.props.navigateToToday}>
          Today
        </button>
        <button className="mdl-button mdl-js-button mdl-button--icon" onClick={this.props.navigateToPreviousWeek}>
          <i className="material-icons">chevron_left</i>
        </button>
        <span style={styles.title}>
          {
            `${moment(this.props.timesheetStore.currentDate).startOf('w').format('MMM DD')}
            - 
            ${moment(this.props.timesheetStore.currentDate).endOf('w').format('DD, YYYY')}`
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
  componentDidMount() {
    componentHandler.upgradeDom();
  }

  render() {
    let styles = {
      table: {
        border: 'none',
        width: '100%'
      },
      supportingText: {
        textAlign: 'center'
      }
    };

    let currentDate = moment(this.props.timesheetStore.currentDate);
    let missions = _.select(this.props.missionStore.missions, (mission) => {
      let startDate = moment(mission.startDate);
      let endDate = moment(mission.endDate);
      return startDate.isBefore(moment(currentDate).endOf('w')) && endDate.isAfter(moment(currentDate).startOf('w'));
    });

    if (_.isEmpty(missions)) {
      return (
        <div className="mdl-card__supporting-text" style={styles.supportingText}>
          There is no mission during this week.
        </div>
      );
    }

    // Forced to use a random key on table to trigger componentDidMount for mdl
    // see: http://quaintous.com/2015/07/09/react-components-with-mdl/
    // and: http://codepen.io/yan-foto/pen/yNjwaO?editors=101
    return (
      <table
        key={`tt-timesheet-table-view-${Date.now()}`}
        className="mdl-data-table mdl-js-data-table mdl-data-table--selectable"
        style={styles.table}
      >
        <TimesheetHeaderView {...this.props} />
        <TimesheetBodyView {...this.props} missions={missions} />
      </table>
    );
  }
}

class TimesheetHeaderView extends Component {
  componentDidMount() {
    componentHandler.upgradeDom();
  }

  render() {
    let dayOfWeek = moment(this.props.timesheetStore.currentDate).startOf('w');
    let styles = {
      label: {
        marginRight: '40px'
      }
    };

    return (
      <thead>
        <th className="mdl-data-table__cell--non-numeric"></th>
        {_.times(7, n => {
          return (
            <th key={`tt-timesheet-header-view-${n}`}>
              <span style={styles.label}>
                {dayOfWeek.add(n == 0 ? n : 1, 'd').format('ddd DD')}
              </span>
            </th>
          );
        })}
        <th></th>
      </thead>
    );
  }
}

class TimesheetBodyView extends Component {
  componentDidMount() {
    componentHandler.upgradeDom();
  }

  render() {
    let styles = {
      text: {
        lineHeight: '42px'
      },
      cell: {
        paddingTop: '0'
      }
    };

    return (
      <tbody>
        {this.props.missions.map(mission => {
          let workblocks = _.select(this.props.workblockStore.workblocks, workblock => {
            return workblock.missionId == mission._id;
          });
          let dayOfWeek = moment(this.props.timesheetStore.currentDate).startOf('w');
          let rowTotal = 0;
          return (
            <tr key={mission._id}>
              <td className="mdl-data-table__cell--non-numeric">
                <span style={styles.text}>{`${mission.label}`}</span>
              </td>
              {_.times(7, n => {
                let startTime = moment(dayOfWeek).startOf('d');
                let cell = '';
                if (startTime.isBetween(moment(mission.startDate).startOf('d').subtract(1, 'ms'), moment(mission.endDate).endOf('d'))) {
                  let endTime = moment(startTime).add(1, 'd');
                  let workblock = _.find(workblocks, workblock => {
                    return moment(workblock.startTime).isBetween(startTime, endTime);
                  });
                  if (workblock) rowTotal += workblock.quantity;
                  cell = <TimesheetCellView {...workblock} startTime={moment(startTime)} />;
                }
                dayOfWeek.add(1, 'd');
                return (<td key={`tt-timesheet-cell-view-${n}`} style={styles.cell}>{cell}</td>);
              })}
              <td>
                <span style={styles.text} className="mdl-color-text--pink-A200">{rowTotal}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }
}

class TimesheetCellView extends Component {
  componentDidMount() {
    componentHandler.upgradeDom();
  }

  // onChangeQuantity = (event) => {
  //   if (new RegExp(event.target.pattern).test(event.target.value)) {
  //     this.props.updateMissionWorkBlock({
  //       id: this.props.id,
  //       description: this.props.description,
  //       quantity: event.target.value,
  //       startTime: this.props.startTime || this.props.startTime
  //     });
  //   }
  // }

  render() {
    let styles = {
      quantityWrapper: {
        marginRight: '8px',
        width: '30px'
      },
      quantityInput: {
        fontSize: '14px',
        textAlign: 'right'
      }
    };

    return (
      <div>
        <div className="mdl-textfield mdl-js-textfield" style={styles.quantityWrapper}>
          <input
            className="mdl-textfield__input"
            type="text"
            pattern="^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$"
            style={styles.quantityInput}
            value={this.props.quantity}
          />
          <label className="mdl-textfield__label"></label>
        </div>
        <button className="mdl-button mdl-js-button mdl-button--icon mdl-color-text--grey-400">
          <i className="material-icons">{this.props.description ? 'message' : 'feedback'}</i>
        </button>
      </div>      
    );
  }
}
