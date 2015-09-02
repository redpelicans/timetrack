import React from 'react';

class NotFound extends React.Component {
  render() {
    return <h1>Not Found ({this.props.params} is unknown)</h1>;
  }
}

export default NotFound;
