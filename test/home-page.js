import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import HomePage from '../src/home-page';
import assert from './assertions';
import {
  describeComponent,
  thumbnailSelector,
  thumbnailSrc,
  simulateClick
} from './test-helpers';
import addResourceTests from './resource-subclass';

describeComponent(HomePage, reactTest => {

  addResourceTests(HomePage);

  it('should render thumbnails', () => {
    let thumbnailObjects = [
      {
        rel: 'collection-image',
        href: 'https://api.com/images/1',
        embed: {
          links: [],
          src: 'https://images.com/image.jpeg'
        }
      },
      {
        rel: 'collection-image',
        href: 'https://api.com/images/2',
        embed: {
          links: [],
          src: 'https://images.com/image2.jpeg'
        }
      }
    ]
    act(() => {
      reactTest.ref.current.setThumbnails(thumbnailObjects);
    });
    let { document } = reactTest;
    let thumbnails = document
      .querySelector('.thumbnails')
      .querySelectorAll(thumbnailSelector);
    for(let i = 0; i < thumbnailObjects.length; ++i)
      assert.equal(
        thumbnailSrc(thumbnails[i]),
        thumbnailObjects[i].embed.src
      );
  });

  it('should read collection images', () => {
    let homePage = reactTest.ref.current;
    let collectionImages = [
      {
        rel: 'collection-image',
        href: 'https://api.com/collection/1'
      },
      {
        rel: 'collection-image',
        href: 'https://api.com/collection/2'
      }
    ];
    act(() => {
      homePage.readResource({links: collectionImages});
    });
    assert.deepEqual(homePage.state.thumbnails, collectionImages);
  });

  describe('show library entry modal button', () => {

    it('should render', () => {
      assert.rendered(reactTest.document, '.library-entry-modal-button');
    });

    it('should make the library entry modal visible iff clicked', () => {
      let modal = reactTest.document.querySelector('.library-entry-modal');
      assert.ok(
        modal.classList.contains('hidden'),
        '"Hidden" class not assigned to modal'
      );
      simulateClick(reactTest.document, '.library-entry-modal-button');
      assert.ok(
        !modal.classList.contains('hidden'),
        '"Hidden" class still assigned after clicking button to show modal'
      );
    });

  });

  describe('library entry form', () => {

    let fileInputSelector = 'form input#file-input';
    let urlInputSelector = 'form input#url-input';

    it('should give an option to select either a file or a URL input', () => {
      assert.rendered(reactTest.document, '.from-computer');
      assert.rendered(reactTest.document, '.from-web');
    });

    it('should show a file input if the from-computer option is clicked', () => {
      simulateClick(reactTest.document, '.from-computer');
      let input = reactTest.document.querySelector(fileInputSelector);
      assert.ok(input, 'No file input rendered');
      assert.equal(input.type, 'file');
    });

    it('should show a URL input if the from-web option is clicked', () => {
      simulateClick(reactTest.document, '.from-web');
      let input = reactTest.document.querySelector(urlInputSelector);
      assert.ok(input, 'No URL input rendered');
      assert.equal(input.type, 'url');
    });

    it('should not render the file input when the source is "from web"', () => {
      simulateClick(reactTest.document, '.from-web');
      assert.notRendered(reactTest.document, fileInputSelector);
    });

    it('should not render URL input when the source is "from computer"', () => {
      simulateClick(reactTest.document, '.from-computer');
      assert.notRendered(reactTest.document, urlInputSelector);
    });

    it('should render a submit button', () => {
      let submitButton = reactTest
        .document
        .querySelector('input.submit-library-entry');
      assert.ok(submitButton);
      assert.equal(submitButton.type, 'submit');
    });

  });

});
