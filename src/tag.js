import React from 'react';
import Resource from './resource';

export default class Tag extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      tagName: ''
    };
  }

  setName(name) {
    this.setState({tagName: name});
  }

  render() {
    return <span className="tag-name">{this.state.tagName}</span>
  }

}
