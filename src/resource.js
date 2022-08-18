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
    if(this.props.embed)
      this.readResource(this.props.embed);
    this.refresh();
  }

  refresh() {
    this.props.backend.loadResource(this.props.url).then(this.readResource);
  }

  render() {
  }

}
