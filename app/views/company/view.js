import _ from 'lodash';
import moment from 'moment';
import Remarkable from 'remarkable';
import React, {Component} from 'react';
import routes from '../../routes';
import classNames from 'classnames';
import {AvatarView, TextLabel, MarkdownText} from '../widgets';
import {timeLabels} from '../helpers';
import {Content } from '../layout';
import {companiesStore, companiesActions, sortMenu} from '../../models/companies';

export default class ViewCompanyApp extends Component {
  state = {};

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    const companyId = this.props.location.state.id;
    const company = companiesStore.getById(companyId);
    this.setState({
      companyId: companyId,
      company: company
    });
  }

  componentWillUnmount(){
    this.unsubcribe();
  }

  componentDidMount(){
    this.unsubcribe = companiesStore.listen( state => {
      const company = companiesStore.getById(this.state.companyId);
      this.setState({company: company});
    });
  }

  goBack = () => {
    this.props.history.goBack();
  }

  handleEdit= (company) => {
    this.props.history.pushState({id: company.get('_id')}, routes.editcompany.path);
  }

  handleDelete = (company) => {
    let answer = confirm(`Are you sure to delete the company "${company.get('name')}"`);
    if(answer){
      companiesActions.delete(company);
      this.goBack();
    }
  }

  render(){
    if(!this.state.company) return false;
    return (
      <Content>
        <Header company={this.state.company} goBack={this.goBack} onEdit={this.handleEdit} onDelete={this.handleDelete}/>
        <Card company={this.state.company}/>
      </Content>
    )
  }
}

const Card = ({company}) =>  {
  const styles={
    container:{
      marginTop: '3rem',
    },
  }

  return (
    <div style={styles.container} className="row" >
      <div className="col-md-4 ">
        <TextLabel label="Type" value={company.get('type')}/>
      </div>
      <div className="col-md-8 ">
        <TextLabel isUrl={true} label="website" value={company.get('website')}/>
      </div>
      <div className="col-md-5">
        <TextLabel label="Street" value={company.getIn(['address', 'street'])}/>
      </div>
      <div className="col-md-2">
        <TextLabel label="Zip Code" value={company.getIn(['address', 'zipcode'])}/>
      </div>
      <div className="col-md-2">
        <TextLabel label="City" value={company.getIn(['address', 'city'])}/>
      </div>
      <div className="col-md-3">
        <TextLabel label="Country" value={company.getIn(['address', 'country'])}/>
      </div>
      <div className="col-md-12">
        <MarkdownText label="Note" value={company.get('note')}/>
      </div>
    </div>
  )
}

const Phones = ({company}) => {
  return render.length ? render : <div/>;
}

const Header = ({company, goBack, onEdit, onDelete}) => {
  const avatar = <AvatarView obj={company.toJS()}/>;
  const styles={
    container:{
      paddingTop: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    left:{
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      minWidth: '500px',
    },
    right:{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
    },
    name:{
      flexShrink: 0,
    },
    perferred:{
      color: company.get('preferred') ? '#00BCD4' : 'grey',
    },
    time: {
      fontSize: '.7rem',
      fontStyle: 'italic',
      display: 'block',
      float: 'right',
    },
  }

  const handleClick = (e) => {
    e.preventDefault();
    goBack();
  }

  return (
    <div>
      <div style={styles.container} className="tm title">
        <div style={styles.left}>
          <div>
            <a href="#" className="fa fa-arrow-left m-r" onClick={handleClick}/>
          </div>
          <div className="m-r">
            {avatar}
          </div>
          <div style={styles.name} className="m-r">
            {company.get('name')}
          </div>
          <div>
            <i style={styles.perferred} className="fa fa-star-o m-r"/>
          </div>
        </div>
        <div style={styles.right}>
          <Edit company={company} onEdit={onEdit}/>
          <Delete company={company} onDelete={onDelete}/>
        </div>
      </div>
      <hr/>
      <div style={styles.time} >
        {timeLabels(company.toJS())}
      </div>
    </div>
  )
}

const Edit = ({company, onEdit}) => {
  const handleChange = (e) => {
    onEdit(company);
    e.preventDefault();
  }

  let style={
    fontSize: '1.2rem',
    color: 'grey',
  };

  return (
    <a href="#" onClick={handleChange}>
      <i style={style} className="iconButton fa fa-pencil m-r"/>
    </a>
  )
}

const Delete =({company, onDelete}) => {
  const handleChange = (e) => {
    onDelete(company);
    e.preventDefault();
  }

  let style={
    fontSize: '1.2rem',
    color: 'grey',
  };

  return (
    <a href="#" onClick={handleChange}>
      <i style={style} className="iconButton fa fa-trash m-r"/>
    </a>
  )
}


