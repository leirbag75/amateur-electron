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

  it('should read necessary fields from server response', () => {
    let tagViewer = reactTest.ref.current;
    act(() => {
      tagViewer.readResource({
        links: [
          {
            rel: 'edit-tag',
            href: 'https://api.com/tags/1'
          }
        ],
        name: 'some tag',
        hidden: true
      });
    });
    let nameInput = getNameInput(reactTest.document);
    let hiddennessInput = getHiddennessInput(reactTest.document);
    assert.equal(nameInput.value, 'some tag');
    assert.equal(hiddennessInput.checked, true);
    assert.equal(tagViewer.state.relEditTag, 'https://api.com/tags/1');
  });

  it('should render a "save changes" button', () => {
    let submitInput = getSubmitInput(reactTest.document);
    assert.ok(submitInput);
    assert.equal(submitInput.type, 'submit');
  });

  describe('editTag', () => {

    let tagViewer;

    beforeEach(() => {
      tagViewer = reactTest.ref.current;
    });

    it('should throw an error when not enabled', () => {
      assert.throws(
        () => {
          tagViewer.editTag('some name', true);
        },
        OperationNotEnabled,
        'editTag called while not enabled, but no error thrown'
      );
    });

    it('should call editTag on the backend if enabled', () => {
      sinon.replace(reactTest.backend, 'editTag', sinon.fake());
      act(() => {
        tagViewer.enableEditing('https://api.com/tags/1');
      });
      tagViewer.editTag('some name', true);
      assert.calledOnceWith(
        reactTest.backend,
        'editTag',
        'https://api.com/tags/1',
        'some name',
        true
      );
    });

    it('should be called when the edit tag form is submitted', () => {
      sinon.replace(tagViewer, 'editTag', sinon.fake());
      let nameInput = getNameInput(reactTest.document);
      let hiddennessInput = getHiddennessInput(reactTest.document);
      nameInput.value = 'blah';
      hiddennessInput.checked = true;
      simulateClick(
        reactTest.document,
        `${formSelector} input.submit-tag-changes`
      );
      assert.calledOnceWith(
        tagViewer,
        'editTag',
        'blah',
        true
      );
    });

    it('should process the checkbox correctly', () => {
      sinon.replace(tagViewer, 'editTag', sinon.fake());
      let nameInput = getNameInput(reactTest.document);
      let hiddennessInput = getHiddennessInput(reactTest.document);
      nameInput.value = 'blah';
      hiddennessInput.checked = false;
      simulateClick(
        reactTest.document,
        `${formSelector} input.submit-tag-changes`
      );
      assert.calledOnceWith(
        tagViewer,
        'editTag',
        'blah',
        false
      );
    });

  });

});
