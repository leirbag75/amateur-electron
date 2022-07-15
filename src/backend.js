import React from 'react';
import ImageViewer from './image-viewer';

export default class Backend {

  constructor() {
    this.ref = React.createRef();
  }

  get app() {
    return this.ref.current;
  }

  viewImage(url) {
    this.app.setPage(<ImageViewer url={url} backend={this} />);
  }

  loadResource() {
  }

}
