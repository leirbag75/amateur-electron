import React from 'react';
import Resource from './resource';

export default class TagViewer extends Resource {

  render() {
    return <form className="edit-tag-form">
        <input className="tag-name-input" type="text" />
        <input className="tag-hiddenness-input" type="checkbox" />
      </form>
  }

}
