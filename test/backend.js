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
  });

  describe('viewImage', () => {
    it('should switch to the image viewer', () => {
      reactTest.render(App, {}, backend.ref);
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

  describe('like', () => {

    it('should post to the given URL', () => {
      let url = 'https://api.com/images/1/likes';
      backend.like(url);
      assert.ok(backend.http.fetch.calledOnce, 'http.fetch not called');
      let args = backend.http.fetch.getCall(0).args;
      assert.equal(args[0], url);
      assert.equal(args[1].method, 'POST');
    });

  });

  describe('unlike', () => {

    it('should post to the given URL', () => {
      let url = 'https://api.com/images/1/unlikes';
      backend.unlike(url);
      assert.ok(backend.http.fetch.calledOnce, 'http.fetch not called');
      let args = backend.http.fetch.getCall(0).args;
      assert.equal(args[0], url);
      assert.equal(args[1].method, 'POST');
    });

  });

  describe ('addLibraryEntry', () => {

    it('should post the given src to the given URL', () => {
      let url = 'https://api.com/images';
      let src = 'https://images.com/1.jpeg';
      backend.addLibraryEntry(url, src);
      assert.ok(backend.http.fetch.calledOnce, 'http.fetch not called');
      let args = backend.http.fetch.getCall(0).args;
      assert.equal(args[0], url);
      assert.equal(args[1].method, 'POST');
      assert.equal(args[1].body, `{"src":"${src}"}`);
    });

    it('should call viewImage on the response', async () => {
      let url = 'https://api.com/images';
      let src = 'https://images.com/1.jpeg';
      let createdUrl = 'https://api.com/images/1';
      reactTest.render(App, {}, backend.ref);
      let response = {
        links: [
          {
            rel: 'created-image',
            href: createdUrl
          }
        ]
      };
      // We have to return an actual promise for this test
      let mock = {fetch: () => Promise.resolve(response)};
      backend.http = mock;
      await act(async () => {
        await backend.addLibraryEntry(url, src);
      });
      let currentPage = backend.app.currentPage;
      assert.equal(currentPage.type, ImageViewer);
      assert.equal(currentPage.props.url, createdUrl);
    });

    it('should not call viewImage if response has no "created" link', async () => {
      let url = 'https://api.com/images';
      let src = 'https://images.com/1.jpeg';
      let response = {
        links: []
      };
      // We have to return an actual promise for this test, too
      let mock = {fetch: () => Promise.resolve(response)};
      backend.http = mock;
      sinon.replace(backend, 'viewImage', sinon.fake());
      await backend.addLibraryEntry(url, src);
      assert.ok(!backend.viewImage.calledOnce);
    });

  });

  describe('search', () => {

    it('should post the given query to the given URL', () => {
      let url = 'https://api.com/search';
      let query = '{"operation": "and", "values": [{"operation": "has_tag", "values": "tag1"}, {"operation": "likes_equal_to", "values": [1]}]}';
      backend.search(url, query);
      assert.ok(backend.http.fetch.calledOnce, '"fetch" not called');
      let args = backend.http.fetch.getCall(0).args;
      assert.equal(args[0], url);
      assert.equal(args[1].method, 'POST');
      assert.equal(args[1].body, query);
    });

    it('should return whatever fetch returns', () => {
      backend.http.fetch = sinon.fake.returns(1);
      assert.equal(backend.search('a', 'b'), 1);
    });

  });

  describe('addTag', () => {

    it('should post the given tag name to the given URL', () => {
      let url = 'https://api.com/tag_entries';
      backend.addTag(url, 'aTag');
      assert.ok(backend.http.fetch.calledOnce, '"fetch" not called');
      let args = backend.http.fetch.getCall(0).args;
      assert.equal(args[0], url);
      assert.equal(args[1].method, 'POST');
      assert.equal(args[1].body, '{"name":"aTag"}');
    });

    it('should return whatever fetch returns', () => {
      backend.http.fetch = sinon.fake.returns(1);
      assert.equal(backend.addTag('a', 'b'), 1);
    });

  });

});
