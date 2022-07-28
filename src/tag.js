import React from 'react';
import Resource from './resource';

let readers = [
  {
    read(resource, viewer) {
      viewer.setName(resource.name);
    }
  }
]

export default class Tag extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      tagName: ''
    };
  }

  readers() {
    return readers;
  }

  setName(name) {
    this.setState({tagName: name});
  }

  render() {
    return <span className="tag-name">{this.state.tagName}</span>
  }

}
