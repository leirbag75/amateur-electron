import React from 'react';
import Resource from './resource';

export default class TagViewer extends Resource {

  constructor(props) {
    super(props);
    this.hiddennessInput = React.createRef();
    this.nameInput = React.createRef();
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
      </form>
  }

}
