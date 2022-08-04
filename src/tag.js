import React from 'react';
import Resource from './resource';
import { FieldReader } from './readers';

let readers = [
  new FieldReader('name', 'setName')
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
