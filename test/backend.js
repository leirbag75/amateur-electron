import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import assert from './assertions';
import React from 'react';
import Backend from '../src/backend';
import { withReactTest } from './test-helpers';
import App from '../src/app';
import ImageViewer from '../src/image-viewer';

class MockHttp {
  fetch = sinon.fake.returns({then: sinon.fake()});
}

withReactTest('backend', reactTest => {

  let backend, app;

  beforeEach(() => {
    backend = new Backend(new MockHttp());
    reactTest.render(App, {}, backend.ref);
  });

  describe('viewImage', () => {
    it('should switch to the image viewer', () => {
      let url = 'https://site.com/image.jpeg';
      act(() => {
        backend.viewImage(url);
      });
      let currentPage = backend.app.currentPage;
      assert.equal(currentPage.type, ImageViewer);
      assert.equal(currentPage.props.url, url);
    });
  });

  describe('loadResource', () => {

    let url = 'https://api.com/resources/1';

    it('should return whatever http.fetch returns', () => {
      let result = backend.loadResource(url);
      assert.equal(result, backend.http.fetch(url));
    });

    it('should pass the given URL to http.fetch', () => {
      backend.loadResource(url);
      assert.calledOnceWith(backend.http, 'fetch', url);
    });

  });

});
