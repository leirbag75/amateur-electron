import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import assert from './assertions';
import { describeComponent } from './test-helpers';
import LibraryEntryForm from '../src/library-entry-form';

describeComponent(LibraryEntryForm, reactTest => {

  it('should give an option to select either a file or a URL input', () => {
    assert.rendered(reactTest.document, '.from-computer');
    assert.rendered(reactTest.document, '.from-web');
  });

});
