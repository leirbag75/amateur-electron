import React from 'react';
import Resource from './resource';
import * as Reader from './readers';

let readers = [
  new Reader.FieldReader('name', 'setName'),
  new Reader.FieldReader('hidden', 'setHiddenness')
];

export default class TagViewer extends Resource {

  constructor(props) {
    super(props);
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

  render() {
    return <form className="edit-tag-form">
        <input className="tag-name-input" type="text" ref={this.nameInput} />
        <input
          className="tag-hiddenness-input"
          type="checkbox"
          ref={this.hiddennessInput}
        />
        <input className="submit-tag-changes" type="submit" />
      </form>
  }

}
