import React from 'react';
import {Content} from './layout';

const UnAuthorized = () => {
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
        <h3>Sorry but previous action is unauthorized </h3>;
      </div>
    </Content>
  )
}

export default UnAuthorized;
