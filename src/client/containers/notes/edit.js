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
import {FadeIn, Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn} from '../../components/widgets'
import {Header, HeaderLeft, HeaderRight, GoBack, Title } from '../../components/widgets'
import {DateField, MultiSelectField2, MarkdownEditField, InputField, DropdownField} from '../../components/fields'

import noteForm from '../../forms/note2'
import {newNoteSelector, editNoteSelector} from '../../selectors/notes'

class NewNote extends Component {

  state = {forceLeave: false, type: undefined};

  static contextTypes = {
    history: PropTypes.object.isRequired,
    router:  PropTypes.object.isRequired,
  }

  routerWillLeave = nextLocation => {
    if (!this.state.forceLeave && this.state.hasBeenModified) return 'Are you sure you want to leave the page without saving new mission?'
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
    if (this.unsubscribeEntity) this.unsubscribeEntityType()
    if (this.unsubscribeEntityId) this.unsubscribeEntityId()
  }

  onSubmit = () => {
    return this.noteForm.onSubmit( (state, note) => {
      this.props.dispatch(notesActions.create(note))
      this.goBack(true)
    })
  }

  componentWillMount() {
    const { dispatch, getState, persons, companies, missions } = this.props

    this.noteForm = (this.props.note)
      ? noteForm(this.props.note.toJS())
      : noteForm()

    this.unsubscribeSubmit = this.onSubmit()

    this.unsubscribeState = this.noteForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      })
    })

    const entityIdField = this.noteForm.field('entityId')
    const entityTypeField = this.noteForm.field('entityType')

    this.unsubscribeEntityType = entityTypeField.onValue( state => {
      const entities = (type) => {
        switch (type) {
          case 'company': return companies;
          case 'mission': return missions;
          case 'person':  return persons;
          default:        return undefined;
        }
      }(state.value)

      const label = (type) => {
        switch (type) {
          case 'company': return 'Company';
          case 'mission': return 'Mission';
          case 'person':  return 'Person';
          default:        return 'Entity';
        }
      }(state.value)

      const domain = entitiesToDomain(entities)

      entityIdField.disabled(!state.value)

      if(this.state.type) {
        entityIdField.setValue(undefined)
      }

      entityIdField.setSchemaValue('domainValue', _.sortBy(domain, 'value'))
      entityIdField.setSchemaValue('required', !!state.value)
      entityIdField.setSchemaValue('label', label)

      this.setState({type: state.value})
    })

    const assigneesIds = this.noteForm.field('assigneesIds')
    assigneesIds.setSchemaValue('domainValue', entitiesToDomain(persons.filter(getWorkersFilter)))
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

  onSubmit = () => {
    return this.noteForm.onSubmit( (state, document) => {
      this.props.dispatch(notesActions.update(this.props.note.toJS(), document))
      this.goBack(true)
    })
  }

  render() {
    let submitBtn = <UpdateBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit && this.state.hasBeenModified}/>;
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
  render() {
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
                <ResetBtn obj={this.props.noteForm} />
              </HeaderRight>
            </Header>

            <FadeIn>
              <div className="col-md-12">
                <Form>
                  <div className="row">
                    <MarkdownEditField field={this.props.noteForm.field('content')} />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <DateField field={this.props.noteForm.field('dueDate')} />
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          <InputField field={this.props.noteForm.field('/notification/delay')} />
                        </div>
                        <div className="col-md-6">
                          <DropdownField field={this.props.noteForm.field('/notification/unit')} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <MultiSelectField2 field={this.props.noteForm.field('/assigneesIds')} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <DropdownField field={this.props.noteForm.field('entityType')} />
                    </div>
                    <div className="col-md-6">
                      <DropdownField field={this.props.noteForm.field('entityId')} />
                    </div>
                  </div>
                </Form>
              </div>
            </FadeIn>
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

const getWorkersFilter = p => p.get('type') === 'worker'

function entitiesToDomain(xs) {
  if (!xs) return []
  return _.chain(xs.toJS())
    .map(x => { return {key: x._id, value: x.name} })
    .value()
}

export const NewNoteApp = connect(newNoteSelector)(NewNote)
export const EditNoteApp = connect(editNoteSelector)(EditNote)
