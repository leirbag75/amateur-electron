import React from 'react';

export default class Resource extends React.Component {

  readResource = () => {
  }

  componentDidMount() {
    this.props.backend.loadResource(this.props.url, this.readResource);
  }

  render() {
  }

}
