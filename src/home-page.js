import React from 'react';
import Resource from './resource';
import Thumbnail from './thumbnail';
import { LinkListReader, LinkReader } from './readers';
import LibraryEntryForm from './library-entry-form';
import { OperationNotEnabled } from './errors';

let readers = [
  new LinkListReader('collection-image', 'setThumbnails'),
  new LinkReader('add-library-entry', 'enableAddingLibraryEntries')
];

export default class HomePage extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      thumbnails: [],
      libraryEntryModalVisible: false,
      relAddLibraryEntry: ''
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

  hideLibraryEntryModal = () => {
    this.setState({libraryEntryModalVisible: false});
  }

  addLibraryEntry = src => {
    if(!this.state.relAddLibraryEntry)
      throw new OperationNotEnabled('Adding library entries not enabled');
    this.props.backend.addLibraryEntry(this.state.relAddLibraryEntry, src);
  }

  enableAddingLibraryEntries(url) {
    this.setState({relAddLibraryEntry: url});
  }

  render() {
    return <div>
        <button className="library-entry-modal-button" onClick={this.showLibraryEntryModal}>
          Add picture
        </button>
        <form className="search">
          <input className="query-input" type="text" />
          <input className="submit-search" type="submit" />
        </form>
        <LibraryEntryForm visible={this.state.libraryEntryModalVisible} onSubmit={this.addLibraryEntry} onClose={this.hideLibraryEntryModal} />
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
