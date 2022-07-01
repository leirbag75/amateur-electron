import { describe, it } from 'mocha';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import ImageViewer from '../src/image-viewer';
import { strict as assert } from 'assert';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('ImageViewer', () => {

  let backend, ref, document, originalWindow;

  beforeEach(() => {
    backend = {};
    ref = React.createRef();
    let dom = new JSDOM('<!DOCTYPE html><body><div id="root"></div></body>');
    originalWindow = global.window;
    global.window = dom.window;
    document = dom.window.document;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  describe('interactions with backend', () => {

    let url = 'https://api.com/images/1';

    beforeEach(() => {
      backend.loadImage = sinon.fake();
      act(() => {
        let root = createRoot(document.getElementById('root'));
        root.render(<ImageViewer ref={ref} url={url} backend={backend} />);
      });
    });

    it('should call loadImage on backend after mounting', () => {
      assert.ok(
        backend.loadImage.calledOnce,
        '"loadImage" not called on backend'
      );
      assert.ok(
        backend.loadImage.calledWith(url, ref.current),
        '"loadImage" called on backend with wrong arguments'
      );
    });

    describe('liking behavior', () => {

      let relLike = 'https://api.com/images/1/likes';

      it('should throw an error if liking is not enabled', () => {
        assert.ok(ref.current.like, 'Function "like" not defined');
        assert.throws(
          () => {
            ref.current.like();
          },
          Error,
          '"like" called with liking disabled, but no error thrown'
        );
      });

      it('should call "like" on backend if liking is enabled', () => {
        backend.like = sinon.fake();
        act(() => {
          ref.current.enableLiking(relLike);
        });
        ref.current.like();
        assert.ok(backend.like.calledOnce, '"like" not called on backend');
        assert.ok(
          backend.like.calledWith(relLike, ref.current),
          '"like" called on backend with wrong arguments'
        );
      });

      it(
        'should render the like button differently if liking is enabled or not',
        () => {
          let likeButton = document.querySelector('.like-button:not(.active)');
          assert.ok(
            likeButton,
            'Like button not rendered, or rendered as active'
          );
          act(() => {
            ref.current.enableLiking(relLike);
          });
          likeButton = document.querySelector('.like-button.active');
          assert.ok(
            likeButton,
            'Like button not rendered, or rendered as inactive'
          );
        }
      );

    });

    describe('unliking behavior', () => {

      let relUnlike = 'https://api.com/images/1/likes';

      it('should throw an error if unliking is not enabled', () => {
        assert.ok(ref.current.unlike, 'Function "unlike" not defined"');
        assert.throws(() => {
          ref.current.unlike();
        });
      });

      it('should call "unlike" on backend if unliking is enabled', () => {
        backend.unlike = sinon.fake();
        act(() => {
          ref.current.enableUnliking(relUnlike);
        });
        ref.current.unlike();
        assert.ok(backend.unlike.calledOnce, '"unlike" not called on backend');
        assert.ok(
          backend.unlike.calledWith(relUnlike, ref.current),
          '"unlike" called on backend with wrong arguments'
        );
      });

      it(
        'should render the unlike button differently if it is enabled or not',
        () => {
          let unlikeButton = document.querySelector('.unlike-button:not(.active)');
          assert.ok(
            unlikeButton,
            'Unlike button not rendered, or rendered as active'
          );
          act(() => {
            ref.current.enableUnliking(relUnlike);
          });
          unlikeButton = document.querySelector('.unlike-button.active');
          assert.ok(
            unlikeButton,
            'Unlike button not rendered, or rendered as inactive'
          );
        }
      );

    });

  });

});
