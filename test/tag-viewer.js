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

  function getNameInput(document) {
    return document.querySelector(`${formSelector} input.tag-name-input`);
  }

  function getHiddennessInput(document) {
    return document.querySelector(`${formSelector} input.tag-hiddenness-input`);
  }

  function getSubmitInput(document) {
    return document.querySelector(`${formSelector} input.submit-tag-changes`);
  }

  it('should show form for editing tag data', () => {
    assert.rendered(reactTest.document, formSelector);
  });

  it('should show textbox for changing tag names', () => {
    let textInput = getNameInput(reactTest.document);
    assert.ok(textInput, 'Tag name input not rendered');
    assert.equal(textInput.type, 'text');
  });

  it('should show checkbox for changing hiddenness of tag', () => {
    let hiddenInput = getHiddennessInput(reactTest.document);
    assert.ok(hiddenInput, 'Tag hiddenness input not rendered');
    assert.equal(hiddenInput.type, 'checkbox');
  });

  it('should change hiddenness value when setHiddenness is called', () => {
    let tagViewer = reactTest.ref.current;
    let hiddenInput = getHiddennessInput(reactTest.document);
    tagViewer.setHiddenness(true);
    assert.equal(hiddenInput.checked, true);
  });

  it('should change name value when setName is called', () => {
    let tagViewer = reactTest.ref.current;
    let nameInput = getNameInput(reactTest.document);
    tagViewer.setName('blah');
    assert.equal(nameInput.value, 'blah');
  });

  it('should read tag name and hiddenness values', () => {
    let tagViewer = reactTest.ref.current;
    tagViewer.readResource({
      links: [],
      name: 'some tag',
      hidden: true
    });
    let nameInput = getNameInput(reactTest.document);
    let hiddennessInput = getHiddennessInput(reactTest.document);
    assert.equal(nameInput.value, 'some tag');
    assert.equal(hiddennessInput.checked, true);
  });

  it('should render a "save changes" button', () => {
    let submitInput = getSubmitInput(reactTest.document);
    assert.ok(submitInput);
    assert.equal(submitInput.type, 'submit');
  });

});
