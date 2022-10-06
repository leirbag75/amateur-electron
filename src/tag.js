import React from 'react';
import Resource from './resource';
import { FieldReader } from './readers';
import { OperationNotEnabled } from './errors';

let readers = [
  new FieldReader('name', 'setName')
]

export default class Tag extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      tagName: '',
      relRemoveTag: ''
    };
  }

  readers() {
    return readers;
  }

  setName(name) {
    this.setState({tagName: name});
  }

  enableRemoving(url) {
    this.setState({relRemoveTag: url});
  }

  removeTag() {
    if(!this.state.relRemoveTag)
      throw new OperationNotEnabled('Removing tag not enabled');
    this.props.backend.removeTag(this.state.relRemoveTag);
  }

  render() {
    return <span className="tag-name">{this.state.tagName}</span>
  }

}
