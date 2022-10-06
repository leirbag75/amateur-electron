import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import App from '../src/app';
import Tag from '../src/tag';
import assert from './assertions';
import { describeComponent, simulateClick  } from './test-helpers';
import React from 'react';
import addResourceTests from './resource-subclass.js';
import { OperationNotEnabled } from '../src/errors';
import sinon from 'sinon';

describeComponent(Tag, reactTest => {

  addResourceTests(Tag);

  let ref, document, url = 'https://api.com/tags/1';

  beforeEach(() => {
    ({ ref, document } = reactTest);
  });

  it('should set tag name', () => {
    act(() => {
      ref.current.setName('blah');
    })
    assert.equal(document.querySelector('.tag-name').innerHTML, 'blah');
  });

  describe('removeTag', () => {

    it('should throw an error if not enabled', () => {
      assert.throws(
        () => {
          ref.current.removeTag();
        },
        OperationNotEnabled,
        'removeTag called while not enabled, but no error thrown'
      );
    });

    it('should call "removeTag" on the backend if enabled', () => {
      sinon.replace(reactTest.backend, 'removeTag', sinon.fake());
      let url = 'https://api.com/tag_entries/120_23';
      act(() => {
        ref.current.enableRemoving(url);
      });
      ref.current.removeTag();
      assert.calledOnceWith(reactTest.backend, 'removeTag', url);
    });

  });

  describe('remove button', () => {

    it('should render when removing is enabled', () => {
      act(() => {
        ref.current.enableRemoving('https://api.com/tag_entries/1_2');
      });
      assert.rendered(document, '.remove-tag-button');
    });

    it('should not render when removing is disabled', () => {
      assert.notRendered(document, '.remove-tag-button');
    });

    it('should call removeTag on backend when clicked', () => {
      sinon.replace(reactTest.backend, 'removeTag', sinon.fake());
      let url = 'https://api.com/tag_entries/1_2';
      act(() => {
        ref.current.enableRemoving(url);
      });
      simulateClick(document, '.remove-tag-button');
      assert.calledOnceWith(reactTest.backend, 'removeTag', url);
    });

  });

  it('should read remove-tag link from response', () => {
    let url = 'https://api.com/tag_entries/1_2';
    act(() => {
      ref.current.readResource({
        links: [
          {
            rel: 'remove-tag',
            href: url
          }
        ],
        name: 'blah'
      });
    });
    assert.equal(ref.current.state.relRemoveTag, url);
  });

});
