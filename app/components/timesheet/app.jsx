import React, {Component} from 'react';
import AltContainer from 'alt/AltContainer';
import moment from 'moment';
import _ from 'lodash';
// import './style.css';
import MissionActions from '../missions/actions';
import WorkblockActions from '../workblocks/actions';
import WorkblockStore from '../workblocks/store';
import TimesheetActions from './actions';
import TimesheetStore from './store';

export default class TimesheetApp extends Component {
  componentWillMount() {
    // WorkblockActions.fetch();
    MissionActions.fetch();
  }

  render() {
    return (
      <AltContainer
        stores={{workblockStore: WorkblockStore, timesheetStore: TimesheetStore}}
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
        width: '100%'
      }
    };
    
    if (this.props.isFetching) {
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
      label: {
        lineHeight: '42px'
      },
      cell: {
        paddingTop: '0'
      }
    };

    return (
      <tbody>
      </tbody>
    );
  }
}
        // {this.props.missions.map(mission => {
        //   let dayOfWeek = moment(this.props.currentDate).startOf('w');
        //   return (
        //     <tr key={mission.id}>
        //       <td className="mdl-data-table__cell--non-numeric">
        //         <span style={styles.label}>{`${mission.company.label}:${mission.label}`}</span>
        //       </td>
        //       {_.times(7, n => {
        //         let startTime = moment(dayOfWeek).startOf('d');
        //         let endTime = moment(startTime).add(1, 'd');
        //         let workBlock = _.find(mission.workBlocks, workBlock => {
        //           return moment(workBlock.startTime).isBetween(startTime, endTime);
        //         });
        //         dayOfWeek.add(1, 'd');
        //         return (
        //           <td key={`tt-timesheet-cell-view-${n}`} style={styles.cell}>
        //             <TimesheetCellView
        //               {...workBlock}
        //               updateMissionWorkBlock={this.updateMissionWorkBlock.bind(this, mission.id)}
        //               startTime={moment(startTime)}
        //             />
        //           </td>
        //         );
        //       })}
        //     </tr>
        //   );
        // })}

// class TimesheetCellView extends Component {
//   componentDidMount() {
//     componentHandler.upgradeDom();
//   }
//
//   onChangeQuantity = (event) => {
//     if (new RegExp(event.target.pattern).test(event.target.value)) {
//       this.props.updateMissionWorkBlock({
//         id: this.props.id,
//         description: this.props.description,
//         quantity: event.target.value,
//         startTime: this.props.startTime || this.props.startTime
//       });
//     }
//   }
//
//   render() {
//     let styles = {
//       quantityWrapper: {
//         marginRight: '8px',
//         width: '30px'
//       },
//       quantityInput: {
//         fontSize: '14px',
//         textAlign: 'right'
//       }
//     };
//
//     return (
//       <div>
//         <div className="mdl-textfield mdl-js-textfield" style={styles.quantityWrapper}>
//           <input
//             className="mdl-textfield__input"
//             type="text"
//             pattern="^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$"
//             style={styles.quantityInput}
//             defaultValue={this.props.quantity}
//             onChange={this.onChangeQuantity}
//           />
//           <label className="mdl-textfield__label"></label>
//         </div>
//         <button className="mdl-button mdl-js-button mdl-button--icon mdl-color-text--grey-400">
//           <i className="material-icons">{this.props.description ? 'message' : 'feedback'}</i>
//         </button>
//       </div>      
//     );
//   }
// }
