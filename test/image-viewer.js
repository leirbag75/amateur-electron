import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import ImageViewer from '../src/image-viewer';
import assert from './assertions';
import { describeComponent } from './test-helpers';
import addResourceTests from './resource-subclass';

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
      backend[testAttributes.name] = sinon.fake();
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
        let button = document.querySelector(`${testAttributes.buttonClassName}:not(.active)`);
        assert.ok(
          button,
          `${testAttributes.capitalizedName} button not rendered, or rendered as active`
        );
        act(() => {
          ref.current[testAttributes.enableFunctionName](rel);
        });
        button = document.querySelector(`${testAttributes.buttonClassName}.active`);
        assert.ok(
          button,
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
        act(() => {
          let button = document.querySelector(testAttributes.buttonClassName);
          button.dispatchEvent(new window.MouseEvent('click', {bubbles: true}));
        });
        assert.ok(
          ref.current[testAttributes.name].calledOnce,
          `${testAttributes.capitalizedName} button clicked, but "${testAttributes.name}" callback not called`
        );
      }
    );

  });

}

describeComponent('ImageViewer', reactTest => {

  addResourceTests(ImageViewer);

  let backend, ref, document, url = 'https://api.com/images/1';

  beforeEach(() => {
    ({backend, ref, document} = reactTest);
    backend.loadResource = sinon.fake();
    reactTest.render(ImageViewer, {url, backend});
  });

  addButtonTests('like', reactTest);

  addButtonTests('unlike', reactTest);

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
