import React from 'react';

export default class ImageViewer extends React.Component {

  componentDidMount() {
    this.props.backend.loadImage(this.props.url, this);
  }

  render() {
  }

}
