import _ from 'lodash'
import Immutable from 'immutable'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {goBack, replace} from '../../actions/routes'
import {missionsActions} from '../../actions/missions'
import {companiesActions} from '../../actions/companies'
import {personsActions} from '../../actions/persons'
import {notesActions} from '../../actions/notes'
import {Content} from '../../components/layout'
import sitemap from '../../routes'
import {Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn} from '../../components/widgets'
import {AvatarView, Header, HeaderLeft, HeaderRight, GoBack, Title } from '../../components/widgets'
import {DateField, MultiSelectField2, MarkdownEditField, InputField, DropdownField} from '../../components/fields'

import noteForm from '../../forms/note2'
import {newNoteSelector, editNoteSelector} from '../../selectors/notes'

class NewNote extends Component {

  state = {forceLeave: false};

  static contextTypes = {
    history: PropTypes.object.isRequired,
    router:  PropTypes.object.isRequired,
  }

  routerWillLeave = nextLocation => {
    if (!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving new mission?"
  }

  goBack = (forceLeave) => {
    this.setState({forceLeave: forceLeave}, () => {
      this.props.dispatch(goBack())
    });
  }

  handleSubmit = () => {
    this.noteForm.submit()
  }

  handleCancel = () => {
    this.goBack(false)
  }

  goBack (forceLeave) {
    this.setState({forceLeave}, () => {
      this.props.dispatch(goBack())
    })
  }

  componentDidMount() {
    const { route } = this.props
    const { router } = this.context
    router.setRouteLeaveHook(route, this.routerWillLeave)
  }

  componentWillUnmount() {
    if (this.unsubscribeSubmit) this.unsubscribeSubmit()
    if (this.unsubscribeState) this.unsubscribeState()
    if (this.unsubscribeEntity) this.unsubscribeEntity()
  }

  componentWillMount() {
    const { dispatch, getState, persons, companies, missions } = this.props

    this.noteForm = noteForm()

    this.unsubscribeSubmit = this.noteForm.onSubmit( (state, document) => {
      dispatch(notesActions.create(document.note, document.entity))
      this.goBack(true)
    })

    this.unsubscribeState = this.noteForm.field('note').onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      })
    })

    const entityIdField = this.noteForm.field('/entity/_id')

    this.unsubscribeEntity = this.noteForm.field('/entity/typeName').onValue( state => {
      const entities = (type) => {
        switch (type) {
          case 'company': return companies;
          case 'mission': return missions;
          case 'person':  return persons;
          default:        return undefined;
        }
      }(state.value)
      entityIdField.setSchemaValue('domainValue', entitiesToDomain(entities))
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      })
    })

    const assigneesIds = this.noteForm.field('/note/assigneesIds')
    assigneesIds.setSchemaValue('domainValue', entitiesToDomain(persons))
  }

  render () {
    let submitBtn = <AddBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit}/>;
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>;

    return (
      <EditContent
        title={"Add a note"}
        submitBtn={submitBtn}
        cancelBtn={cancelBtn}
        goBack={this.goBack}
        noteForm={this.noteForm}/>
    )
  }
}

class EditNote extends NewNote {
  constructor(props) {
    super(props)
  }

  render() {
    let submitBtn = <AddBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit}/>;
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>;

    return (
      <EditContent
        title={"Edit a note"}
        submitBtn={submitBtn}
        cancelBtn={cancelBtn}
        goBack={this.goBack}
        noteForm={this.noteForm}/>
    )
  }
}

class EditContent extends Component {
  state = {hideOption: undefined}

  handleToggle = (e) => {
    e.preventDefault()
    const option  = this.state.hideOption === undefined ? 'true' : this.state.hideOption
    this.setState({
      hideOption: !option,
    })
  }

  render() {

    const getClass = (option) => {
      if (option === undefined) {
        return 'hidden row'
      } else {
        return (!option ? 'animated fadeIn' : 'animated fadeOut') + ' row'
      }
    }

    const animClass = getClass(this.state.hideOption)

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">
            <Header>
              <HeaderLeft>
                <GoBack goBack={this.props.goBack}/>
                <Title title={this.props.title}/>
              </HeaderLeft>
              <HeaderRight>
                {this.props.submitBtn}
                {this.props.cancelBtn}
              </HeaderRight>
            </Header>

            <div className="col-md-12">
              <Form>
                <div className="row m-b-1">
                  <MarkdownEditField field={this.props.noteForm.field('/note/content')} />
                    <a href="#" onClick={this.handleToggle}>
                      <i className="fa fa-lg fa-cog"></i> More
                    </a>
                </div>
                <div className={animClass}>
                  <div className="row">
                    <div className="col-md-6">
                      <DateField field={this.props.noteForm.field('/note/dueDate')} />
                    </div>
                    <div className="col-md-6">
                      <div className="col-md-6">
                        <InputField field={this.props.noteForm.field('/note/notification/delay')} />
                      </div>
                      <div className="col-md-6">
                        <DropdownField field={this.props.noteForm.field('/note/notification/unit')} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <MultiSelectField2 field={this.props.noteForm.field('/note/assigneesIds')} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <DropdownField field={this.props.noteForm.field('/entity/typeName')} />
                    </div>
                    <div className="col-md-6">
                      <DropdownField field={this.props.noteForm.field('/entity/_id')} />
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Content>
    )
  }
}
EditContent.propTypes = {
  title:     PropTypes.string.isRequired,
  goBack:    PropTypes.func.isRequired,
  submitBtn: PropTypes.element.isRequired,
  cancelBtn: PropTypes.element.isRequired,
  noteForm:   PropTypes.object.isRequired,
}

function entitiesToDomain(xs) {
  if (!xs) return []
  return _.chain(xs.toJS())
    .map(x => { return {key: x._id, value: x.name} })
    .value()
}

export const NewNoteApp = connect(newNoteSelector)(NewNote)
export const EditNoteApp = connect(editNoteSelector)(EditNote)
