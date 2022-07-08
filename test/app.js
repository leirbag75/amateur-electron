import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import App from '../src/app';
import ImageViewer from '../src/image-viewer';
import HomePage from '../src/home-page';
import { strict as assert } from 'assert';
import { describeComponent  } from './react-test';

describeComponent('App', reactTest => {

  describe('page switching behavior', () => {

    beforeEach(() => {
      reactTest.render(App, {});
    });

    it('should start on home page', () => {
      assert.equal(reactTest.ref.current.currentPage, HomePage)
    });

    it('should switch pages', () => {
      let app = reactTest.ref.current
      act(() => {
        app.setPage(ImageViewer);
      });
      assert.equal(app.currentPage, ImageViewer);
    });

  });

})
