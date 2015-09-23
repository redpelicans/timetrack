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
        actions={{timesheetActions: TimesheetActions, workblockActions: WorkblockActions}}
      >
        <TimesheetContainer />
      </AltContainer>
    );
  }
}

class TimesheetContainer extends Component {
  render() {
    if (this.props.missionStore.isFetching || this.props.workblockStore.isFetching) {
      return <div className="ui indeterminate active loader"></div>;
    }

    return (
      <div className="ui grid">
        <div className="sixteen wide column">
          <TimesheetNavigationView {...this.props} />
          <TimesheetTableView {...this.props} />
        </div>
      </div>
    );
  }
}

class TimesheetNavigationView extends Component {
  render() {
    return (
      <div>
        <button className="ui primary button" onClick={this.props.timesheetActions.navigateToToday}>Today</button>
        <button className="ui icon button" onClick={this.props.timesheetActions.navigateToPreviousWeek}>
          <i className="angle left icon"></i>
        </button>
        <span style={{padding: '0 20px', textAlign: 'center'}}>
          {`${moment(this.props.timesheetStore.currentDate).startOf('w').format('MMM DD')}- 
            ${moment(this.props.timesheetStore.currentDate).endOf('w').format('DD, YYYY')}`
          }
        </span>
        <button className="ui icon button" onClick={this.props.timesheetActions.navigateToNextWeek}>
          <i className="angle right icon" style={{marginLeft: 0}}></i>
        </button>
      </div>
    );
  }
}

class TimesheetTableView extends Component {
  render() {
    let currentDate = moment(this.props.timesheetStore.currentDate);
    let missions = _.select(this.props.missionStore.missions, (mission) => {
      let startDate = moment(mission.startDate);
      let endDate = moment(mission.endDate);
      return startDate.isBefore(moment(currentDate).endOf('w')) && endDate.isAfter(moment(currentDate).startOf('w'));
    });

    if (_.isEmpty(missions)) {
      return <div className="ui info message"><p>There is no mission during this week.</p></div>;
    }

    return (
      <table className="ui celled table">
        <TimesheetHeaderView {...this.props} missions={missions} />
        <TimesheetBodyView {...this.props} missions={missions} />
      </table>
    );
  }
}

class TimesheetHeaderView extends Component {
  render() {
    let dayOfWeek = moment(this.props.timesheetStore.currentDate).startOf('w');

    return (
      <thead>
        <th>
          <div className="ui label">
            <i className="long arrow down icon"></i>
            Missions
            <div className="detail">{this.props.missions.length}</div>
          </div>
        </th>
        {_.times(7, (n) => {
          return (
            <th key={`tt-timesheet-header-view-${n}`} style={{textAlign: 'center'}}>
              <span>{dayOfWeek.add(n == 0 ? n : 1, 'd').format('ddd DD')}</span>
            </th>
          );
        })}
        <th style={{textAlign: 'right', width: '110px', whiteSpace: 'nowrap'}}>
          <div className="ui label">
            <i className="calculator icon"></i>
            /mission
          </div>
        </th>
      </thead>
    );
  }
}

class TimesheetBodyView extends Component {
  render() {
    let weekTotal = 0;
    let dayOfWeekTotals = {};

    return (
      <tbody>
        {this.props.missions.map(mission => {
          let workblocks = _.select(this.props.workblockStore.workblocks, workblock => {
            return workblock.missionId == mission._id;
          });
          let dayOfWeek = moment(this.props.timesheetStore.currentDate).startOf('w');
          let missionTotal = 0;
          return (
            <tr key={mission._id}>
              <td style={{width: '100%'}}>{`${mission.label}`}</td>
              {_.times(7, n => {
                let startTime = moment(dayOfWeek).startOf('d');
                let cell = '';
                // subtract 1 ms because moment.isBetween() is exclusive
                let startDate = moment(mission.startDate).startOf('d').subtract(1, 'ms');
                let endDate = moment(mission.endDate).endOf('d');
                if (startTime.isBetween(startDate, endDate)) {
                  let endTime = moment(startTime).add(1, 'd');
                  let workblock = _.find(workblocks, workblock => {
                    return moment(workblock.startTime).isBetween(startTime, endTime);
                  });
                  dayOfWeekTotals[dayOfWeek] = dayOfWeekTotals[dayOfWeek] || 0;
                  if (workblock) {
                    missionTotal += workblock.quantity;
                    dayOfWeekTotals[dayOfWeek] += workblock.quantity;
                    weekTotal += workblock.quantity;
                  }
                  cell = <TimesheetCellView {...workblock} startTime={moment(startTime)} />;
                }
                dayOfWeek.add(1, 'd');
                return <td key={`tt-timesheet-cell-view-${n}`} style={{textAlign: 'right'}}>{cell}</td>;
              })}
              <td style={{textAlign: 'right'}}>{missionTotal}</td>
            </tr>
          );
        })}
        <tr>
          <td>
            <div className="ui label">
              <i className="calculator icon"></i>
              /day
            </div>
          </td>
          {_.map(dayOfWeekTotals, (total) => {
            return <td style={{textAlign: 'right'}}>{total}</td>;
          })}
          <td style={{textAlign: 'right'}}>{weekTotal}</td>
        </tr>
      </tbody>
    );
  }
}

class TimesheetCellView extends Component {
  updateWorkBlock = (updates) => {
    // let workblock = {
    //   id: this.props._id,
    //   startTime: this.props.startTime || this.props.startTime,
    //   quantity: this.props.quantity
    //   description: this.props.description
    // }
    // this.props.workblockActions.update(workblock);
  }

  onChangeQuantity = (event) => {
    // if (new RegExp(event.target.pattern).test(event.target.value)) {
    //   // this.props.updateMissionWorkBlock({
    //   id: this.props.id,
    //   description: this.props.description,
    //   quantity: event.target.value,
    //   startTime: this.props.startTime || this.props.startTime
    //   // });
    // }
  }

  render() {
    let iconClass = this.props.description ? 'circular comment link icon' : 'circular comment outline link icon';
    return (
      <div className="ui transparent input">
        <i className={iconClass}></i>
        <input type="text" defaultValue={this.props.quantity} style={{width: '40px', textAlign: 'right'}} />
      </div>
      // <div>
      //   <div className="mdl-textfield mdl-js-textfield" style={styles.quantityWrapper}>
      //     <input
      //       className="mdl-textfield__input"
      //       type="text"
      //       pattern="^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$"
      //       style={styles.quantityInput}
      //       defaultValue={this.props.quantity}
      //       onChange={this.onChangeQuantity}
      //     />
      //     <label className="mdl-textfield__label"></label>
      //   </div>
      //   <button className="mdl-button mdl-js-button mdl-button--icon mdl-color-text--grey-400">
      //     <i className="material-icons">{this.props.description ? 'message' : 'feedback'}</i>
      //   </button>
      // </div>      
    );
  }
}
