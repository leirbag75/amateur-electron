import React from 'react';
import Resource from './resource';
import Thumbnail from './thumbnail';
import { LinkListReader } from './readers';
import LibraryEntryForm from './library-entry-form';

let readers = [
  new LinkListReader('collection-image', 'setThumbnails')
];

export default class HomePage extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      thumbnails: [],
      libraryEntryModalVisible: false
    }
  }

  setThumbnails(thumbnails) {
    this.setState({thumbnails});
  }

  readers() {
    return readers;
  }

  showLibraryEntryModal = () => {
    this.setState({libraryEntryModalVisible: true});
  }

  render() {
    return <div>
        <button className="library-entry-modal-button" onClick={this.showLibraryEntryModal} />
        <LibraryEntryForm visible={this.state.libraryEntryModalVisible} />
        <div className="thumbnails">
          {
            this.state.thumbnails.map(thumbnail =>
              <Thumbnail
              key={thumbnail.href}
              url={thumbnail.href}
              backend={this.props.backend}
              embed={thumbnail.embed}
              />
            )
          }
        </div>
      </div>
  }

}
