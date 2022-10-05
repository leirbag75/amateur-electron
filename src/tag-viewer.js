import React from 'react';
import Resource from './resource';
import * as Reader from './readers';
import { OperationNotEnabled } from './errors';

let readers = [
  new Reader.FieldReader('name', 'setName'),
  new Reader.FieldReader('hidden', 'setHiddenness')
];

export default class TagViewer extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      relEditTag: ''
    };
    this.hiddennessInput = React.createRef();
    this.nameInput = React.createRef();
  }

  readers() {
    return readers;
  }

  setName(value) {
    this.nameInput.current.value = value;
  }

  setHiddenness(value) {
    this.hiddennessInput.current.checked = value;
  }

  editTag(name, hidden) {
    if(!this.state.relEditTag)
      throw new OperationNotEnabled('Editing tag not enabled');
    this.props.backend.editTag(this.state.relEditTag, name, hidden);
  }

  enableEditing(url) {
    this.setState({relEditTag: url});
  }

  onSubmit = event => {
    event.preventDefault();
    this.editTag(
      this.nameInput.current.value,
      this.hiddennessInput.current.checked
    );
  }

  render() {
    return <form className="edit-tag-form" onSubmit={this.onSubmit}>
        <input
          className="tag-name-input"
          type="text"
          ref={this.nameInput}
          name="name"
        />
        <input
          className="tag-hiddenness-input"
          type="checkbox"
          ref={this.hiddennessInput}
          name="hidden"
        />
        <input className="submit-tag-changes" type="submit" />
      </form>
  }

}
