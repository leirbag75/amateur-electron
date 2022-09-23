import React from 'react';
import Resource from './resource';
import Thumbnail from './thumbnail';
import { LinkListReader, LinkReader } from './readers';
import LibraryEntryForm from './library-entry-form';
import { OperationNotEnabled } from './errors';

function standardize(query) {
  if(typeof query === 'string')
    return {
      operation: 'has_tag',
      values: [query]
    };
  else if(typeof query === 'number')
    return {
      operation: 'likes_equal_to',
      values: [query]
    };
  else if(query.and)
    return {
      operation: 'and',
      values: query.and.map(standardize)
    };
  else if(query.or)
    return {
      operation: 'or',
      values: query.or.map(standardize)
    };
  else if(query.not)
    return {
      operation: 'not',
      values: [standardize(query.not)]
    };
  else if(query.likes_less_than)
    return {
      operation: 'likes_less_than',
      values: [query.likes_less_than]
    };
  else if(query.likes_less_than_or_equal_to)
    return {
      operation: 'likes_less_than_or_equal_to',
      values: [query.likes_less_than_or_equal_to]
    };
  else if(query.likes_greater_than)
    return {
      operation: 'likes_greater_than',
      values: [query.likes_greater_than]
    };
  else if(query.likes_greater_than_or_equal_to)
    return {
      operation: 'likes_greater_than_or_equal_to',
      values: [query.likes_greater_than_or_equal_to]
    };
  else
    throw new Error('Invalid query');
}

let readers = [
  new LinkListReader('collection-image', 'setThumbnails'),
  new LinkReader('add-library-entry', 'enableAddingLibraryEntries'),
  new LinkReader('search', 'enableSearch')
];

export default class HomePage extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      thumbnails: [],
      libraryEntryModalVisible: false,
      relAddLibraryEntry: '',
      relSearch: ''
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

  enableSearch(url) {
    this.setState({relSearch: url});
  }

  search(query) {
    if(!this.state.relSearch)
      throw new OperationNotEnabled('Search not enabled');
    return this
      .props
      .backend
      .search(
        this.state.relSearch, JSON.stringify(standardize(JSON.parse(query)))
      ).then(this.readResource);
  }

  onSearch = event => {
    event.preventDefault();
    this.search(event.target.elements.query.value);
  }

  render() {
    return <div>
        <button className="library-entry-modal-button" onClick={this.showLibraryEntryModal}>
          Add picture
        </button>
        <form className="search" onSubmit={this.onSearch}>
          <input className="query-input" type="text" name="query" />
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
