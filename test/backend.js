import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import { strict as assert } from 'assert';
import React from 'react';
import Backend from '../src/backend';
import { describeComponent } from './test-helpers';
import App from '../src/app';
import ImageViewer from '../src/image-viewer';

describeComponent('backend', reactTest => {

  let backend, app;

  beforeEach(() => {
    backend = new Backend();
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

});
