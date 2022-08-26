import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import assert from './assertions';
import { describeComponent, simulateClick } from './test-helpers';
import LibraryEntryForm from '../src/library-entry-form';

describeComponent(LibraryEntryForm, reactTest => {

  it('should give an option to select either a file or a URL input', () => {
    assert.rendered(reactTest.document, '.from-computer');
    assert.rendered(reactTest.document, '.from-web');
  });

  it('should show a file input if the from-computer option is clicked', () => {
    simulateClick(reactTest.document, '.from-computer');
    let input = reactTest.document.querySelector('form input.file-input');
    assert.ok(input, 'No file input rendered');
    assert.equal(input.type, 'file');
  });

  it('should show a URL input if the from-web option is clicked', () => {
    simulateClick(reactTest.document, '.from-web');
    let input = reactTest.document.querySelector('form input.url-input');
    assert.ok(input, 'No URL input rendered');
    assert.equal(input.type, 'url');
  });

  it('should set a flag to show if the source is set to web', () => {
    simulateClick(reactTest.document, '.from-web');
    assert.ok(reactTest.ref.current.state.fromWeb, 'Source not set to "from web"');
  });

  it('should set a flag to show if the source is set to computer', () => {
    simulateClick(reactTest.document, '.from-computer');
    assert.ok(
      !reactTest.ref.current.state.fromWeb,
      'Source not set to "from computer"'
    );
  });

});
