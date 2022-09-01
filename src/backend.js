import React from 'react';
import ImageViewer from './image-viewer';

export default class Backend {

  constructor(http) {
    this.http = http;
    this.ref = React.createRef();
  }

  get app() {
    return this.ref.current;
  }

  viewImage(url) {
    this.app.setPage(<ImageViewer url={url} backend={this} />);
  }

  loadResource(url) {
    return this.http.fetch(url);
  }

  like(url) {
    return this.http.fetch(url, {method: 'POST'});
  }

  unlike = this.like;

  addLibraryEntry(url, src) {
    return this.http.fetch(url, {method: 'POST', body: JSON.stringify({src})})
      .then(response => {
        let link = response.links.find(link => link.rel === 'created-image');
        if(link)
          this.viewImage(link.href);
        return response;
      });
  }

}
