import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import ImageViewer from '../src/image-viewer';
import { strict as assert } from 'assert';
import { describeComponent  } from './react-test';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describeComponent('ImageViewer', reactTest => {

  let backend, ref, document, url = 'https://api.com/images/1';

  beforeEach(() => {
    ({backend, ref, document} = reactTest);
    backend.loadImage = sinon.fake();
    reactTest.render(ImageViewer, {url, backend});
  });

  describe('interactions with backend', () => {

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
        assert.throws(
          () => {
            ref.current.unlike();
          },
          Error,
          '"unlike" called with unliking disabled, but no error thrown'
        );
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

    it('should render the image', () => {
      let image = document.querySelector('img.image-viewed');
      assert.ok(image, 'Image not rendered');
    });

    it('should let the src of the image be changed', () => {
      let image = document.querySelector('img.image-viewed')
      let src = 'www.image.com/image.jpeg'
      act(() => {
        ref.current.setSrc(src);
      });
      assert.equal(image.src, src, "Image's src not changed");
    });

    it('should render tags', () => {
      let tagList = document.querySelector('.tag-list');
      assert.ok(tagList, 'Tag list not rendered');
      let tags = ['drawing', 'female', 'outdoors'];
      assert.ok(tagList.children.length == 0, 'Tag list does not start empty');
      act(() => {ref.current.setTags(tags);});
      let renderedTags = [...tagList.children];
      assert.ok(
        renderedTags.length == tags.length && renderedTags.every((child, i) => child.innerHTML === tags[i]),
        'Rendered tags do not match test tags'
      );
    });

  });

});
