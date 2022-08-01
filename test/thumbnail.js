import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import Thumbnail from '../src/thumbnail';
import assert from './assertions';
import { describeComponent, simulateClick } from './test-helpers';
import addResourceTests from './resource-subclass';

describeComponent('Thumbnail', reactTest => {

  addResourceTests(Thumbnail);

  let document, url = 'https://api.com/resource';

  beforeEach(() => {
    ({ document } = reactTest);
    let { backend } = reactTest;
    reactTest.render(Thumbnail, {backend, url});
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

  it('should call viewImage on the backend', () => {
    let { backend, ref } = reactTest;
    backend.viewImage = sinon.fake();
    ref.current.view();
    assert.calledOnceWith(backend, 'viewImage', url);
  });

  it('should call "view" callback when image is clicked', () => {
    let { ref, document } = reactTest;
    sinon.replace(ref.current, 'view', sinon.fake());
    act(() => {ref.current.setSrc('');}); // Trigger re-render
    simulateClick(document, 'img.thumbnail');
    assert.ok(
      ref.current.view.calledOnce,
      'Thumbnail clicked, but "view" callback not called'
    );
  });

});
