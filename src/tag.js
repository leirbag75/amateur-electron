import React from 'react';
import Resource from './resource';
import { FieldReader, LinkReader } from './readers';
import { OperationNotEnabled } from './errors';

let readers = [
  new FieldReader('name', 'setName'),
  new LinkReader('remove-tag', 'enableRemoving')
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
    return <div className="tag">
        <span className="tag-name">{this.state.tagName}</span>
        {
          this.state.relRemoveTag?
            <span
              className="remove-tag-button"
              onClick={() => this.removeTag()}
            >
              X
            </span>:
            null
        }
      </div>
  }

}
