import React from 'react';
import Resource from './resource';

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

  render() {
    return <img className="thumbnail" src={this.state.src} />
  }

}
