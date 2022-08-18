import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import ImageViewer from '../src/image-viewer';
import assert from './assertions';
import { describeComponent, simulateClick } from './test-helpers';
import addResourceTests from './resource-subclass';

let imageSelector = 'img.image-viewed';

function imageSrc(image) {
  return image.src;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper object to compute the attributes that are different between tests of
// the like button and the unlike button
class ButtonTestAttributes {

  constructor(name) {
    this.name = name;
  }

  get capitalizedName() {
    return capitalize(this.name);
  }

  get enableFunctionName() {
    return `enable${capitalize(this.gerundName)}`;
  }

  get gerundName() {
    return this.name.slice(0, -1) + 'ing';
  }

  get pluralName() {
    return this.name + 's';
  }

  get buttonClassName() {
    return `.${this.name}-button`;
  }

}

function addButtonTests(buttonName, reactTest) {

  let testAttributes = new ButtonTestAttributes(buttonName);
  let rel = 'https://some-url.com';

  describe(`${testAttributes.gerundName} behavior`, () => {

    let backend, ref, document;

    beforeEach(() => {
      ({ backend, ref, document } = reactTest);
    });

    it(
      `should throw an error if ${testAttributes.gerundName} is not enabled`,
      () => {
        assert.ok(
          ref.current[testAttributes.name],
          `Function "${testAttributes.name}" not defined`
        );
        assert.throws(
          () => {
            ref.current[testAttributes.name]();
          },
          Error,
          `"${testAttributes.name}" called with ${testAttributes.gerundName} disabled, but no error thrown`
        );
      }
    );

    it(
      `should call "${testAttributes.name}" on the backend if ${testAttributes.gerundName} is enabled`,
      () => {
        backend[testAttributes.name] = sinon
          .fake
          .returns(Promise.resolve(null));
        act(() => {
          ref.current[testAttributes.enableFunctionName](rel);
        });
        ref.current[testAttributes.name]();
        assert.calledOnceWith(backend, testAttributes.name, rel, ref.current);
      }
    );

    it(
      `should render the ${testAttributes.name} button differently if ${testAttributes.gerundName} is enabled or not`,
      () => {
        assert.rendered(
          document,
          testAttributes.buttonClassName + ':not(.active)',
          `${testAttributes.capitalizedName} button not rendered, or rendered as active`
        );
        act(() => {
          ref.current[testAttributes.enableFunctionName](rel);
        });
        assert.rendered(
          document,
          testAttributes.buttonClassName + '.active',
          `${testAttributes.capitalizedName} button not rendered, or rendered as inactive`
        );
      }
    );

    it(
      `should call "${testAttributes.name}" callback when ${testAttributes.name} button is clicked`,
      () => {
        sinon.replace(ref.current, testAttributes.name, sinon.fake());
        act(() => {
          ref.current[testAttributes.enableFunctionName](rel);
        });
        simulateClick(document, testAttributes.buttonClassName);
        assert.ok(
          ref.current[testAttributes.name].calledOnce,
          `${testAttributes.capitalizedName} button clicked, but "${testAttributes.name}" callback not called`
        );
      }
    );

    it(`should refresh after ${testAttributes.gerundName}`, async () => {
      sinon.replace(ref.current, 'refresh', sinon.fake());
      act(() => {
        ref.current[testAttributes.enableFunctionName](rel);
      });
      await ref.current[testAttributes.name]();
      assert.calledOnceWith(ref.current, 'refresh');
    });

  });

}

describeComponent(ImageViewer, reactTest => {

  addResourceTests(ImageViewer);

  let ref, document, url = 'https://api.com/images/1';

  beforeEach(() => {
    ({ref, document} = reactTest);
  });

  addButtonTests('like', reactTest);

  addButtonTests('unlike', reactTest);

  it('should render the image', () => {
    assert.rendered(document, imageSelector);
  });

  it('should let the src of the image be changed', () => {
    let image = document.querySelector(imageSelector)
    let src = 'www.image.com/image.jpeg'
    act(() => {
      ref.current.setSrc(src);
    });
    assert.equal(imageSrc(image), src, "Image's src not changed");
  });

  it('should render tags', () => {
    let tagList = document.querySelector('.tag-list');
    assert.ok(tagList, 'Tag list not rendered');
    let tags = [
      {href: '1', embed: {name: 'drawing'}},
      {href: '2', embed: {name: 'female'}},
      {href: '3', embed: {name: 'outdoors'}}
    ];
    assert.equal(tagList.children.length, 0, 'Tag list does not start empty');
    act(() => {ref.current.setTags(tags);});
    let renderedTags = [...tagList.children];
    assert.ok(
      renderedTags.length == tags.length && renderedTags.every((child, i) => child.innerHTML === tags[i].embed.name),
      'Rendered tags do not match test tags'
    );
  });

  describe('like count', () => {

    it('should render the like count', () => {
      assert.rendered(document, '.like-count');
    });

    it('should set the like count', () => {
      act(() => {
        ref.current.setLikes(2);
      });
      assert.equal(document.querySelector('.like-count').innerHTML, '2');
    });

  });

  describe('imageViewer.readResource', () => {

    it('should read certain properties', () => {
      let imageViewer = reactTest.ref.current;
      let tags = [
        {
          rel: 'tag',
          href: 'https://api.com/tags/1',
        },
        {
          rel: 'tag',
          href: 'https://api.com/tags/2',
        }
      ];
      let relLike = 'https://api.com/likes'
      let relUnlike =  'https://api.com/unlikes';
      let src = 'https://image.com/image.jpeg';
      act(() => {
        imageViewer.readResource({
          links: [
            {
              rel: 'like',
              href: relLike
            },
            {
              rel: 'unlike',
              href: relUnlike
            },
            ...tags
          ],
          src,
          likes: 3,
        })
      });
      assert.equal(imageViewer.state.src, src);
      assert.equal(imageViewer.state.relLike, relLike);
      assert.equal(imageViewer.state.relUnlike, relUnlike);
      assert.deepEqual(imageViewer.state.tags, tags);
      assert.equal(imageViewer.state.likes, 3);
    });
  });

});
