import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import Thumbnail from '../src/thumbnail';
import assert from './assertions';
import { describeComponent } from './test-helpers';
import addResourceTests from './resource-subclass';

describeComponent('Thumbnail', reactTest => {

  addResourceTests(Thumbnail);

  let document;

  beforeEach(() => {
    ({ document } = reactTest);
    let { backend } = reactTest;
    backend.loadResource = sinon.fake();
    reactTest.render(Thumbnail, {backend});
  });

  describe('image rendering', () => {

    let url =  'https://image.com/image.jpeg', image, ref;

    beforeEach(() => {
      ({ ref } = reactTest);
      image = document.querySelector('img.thumbnail');
    });

    it('should render image', () => {
      assert.ok(image, 'Thumbnail image not rendered');
    });

    it('should set the src', () => {
      act(() => {
        ref.current.setSrc(url);
      });
      assert.equal(image.src, url, 'Thumbnail image src not set');
    });

  });

});
