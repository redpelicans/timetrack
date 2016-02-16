import React, {Component, PropTypes} from 'react';
import {Content} from '../components/layout';
import { connect } from 'react-redux';
import { replaceRoute } from '../actions/routes';
import routes from '../routes';


const NotFound = ({user, dispatch}) => {

  if(user) dispatch(replaceRoute(routes.defaultRoute));

  const styles={
    container:{
      display: 'flex',
      justifyContent: 'center',
      marginTop: '10%',
    }
  };

  return (
    <Content>
      <div style={styles.container}>
        <h3>Sorry but you seems to be lost, current page is unknown </h3>
      </div>
    </Content>
  )

}

NotFound.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user:     PropTypes.object,
}

function mapStateToProps(state) {
  return {
    user: state.login.user
  }
}
export default connect(mapStateToProps)(NotFound);

