import React from 'react';
import Resource from './resource';
import { FieldReader } from './readers';

let readers = [
  new FieldReader('src', 'setSrc')
];

export default class Thumbnail extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      src: ''
    };
  }

  setSrc(src) {
    this.setState({src});
  }

  readers() {
    return readers;
  }

  view = () => {
    this.props.backend.viewImage(this.props.url);
  }

  render() {
    return <img className="thumbnail" src={this.state.src} onClick={this.view} />
  }

}
