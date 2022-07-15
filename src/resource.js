import React from 'react';

export default class Resource extends React.Component {

  readers() {
    return [];
  }

  readResource = resource => {
    for(let reader of this.readers())
      reader.read(resource, this);
  }

  componentDidMount() {
    this.props.backend.loadResource(this.props.url, this.readResource);
  }

  render() {
  }

}
