import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import App from '../src/app';
import Tag from '../src/tag';
import { strict as assert } from 'assert';
import { describeComponent  } from './test-helpers';
import React from 'react';
import addResourceTests from './resource-subclass.js';

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

});
