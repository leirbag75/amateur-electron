import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import TagViewer from '../src/tag-viewer';
import assert from './assertions';
import { describeComponent, simulateClick } from './test-helpers';
import addResourceTests from './resource-subclass';
import { OperationNotEnabled } from '../src/errors';

describeComponent(TagViewer, reactTest => {

  addResourceTests(TagViewer);

  let formSelector = 'form.edit-tag-form';

  it('should show form for editing tag data', () => {
    assert.rendered(reactTest.document, formSelector);
  });

  it('should show textbox for changing tag names', () => {
    let textInput = reactTest
      .document
      .querySelector(`${formSelector} input.tag-name-input`);
    assert.ok(textInput, 'Tag name input not rendered');
    assert.equal(textInput.type, 'text');
  });

  it('should show checkbox for changing hiddenness of tag', () => {
    let hiddenInput = reactTest
      .document
      .querySelector(`${formSelector} input.tag-hiddenness-input`);
    assert.ok(hiddenInput, 'Tag hiddenness input not rendered');
    assert.equal(hiddenInput.type, 'checkbox');
  });

});
