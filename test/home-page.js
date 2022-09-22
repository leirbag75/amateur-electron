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
import { OperationNotEnabled } from '../src/errors';

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
      let modalContainer = reactTest
        .document
        .querySelector('.library-entry-modal-container');
      assert.ok(
        modalContainer.classList.contains('hidden'),
        '"Hidden" class not assigned to modal'
      );
      simulateClick(reactTest.document, '.library-entry-modal-button');
      assert.ok(
        !modalContainer.classList.contains('hidden'),
        '"Hidden" class still assigned after clicking button to show modal'
      );
    });

    it('should make the library entry modal invisible when its background is clicked', () => {
      simulateClick(reactTest.document, '.library-entry-modal-button');
      simulateClick(reactTest.document, '.library-entry-modal-container');
      let modalContainer = reactTest
        .document
        .querySelector('.library-entry-modal-container');
      assert.ok(
        modalContainer.classList.contains('hidden'),
        'Library entry modal not closed after clicking background'
      );
    });

  });

  describe('addLibraryEntry behavior', () => {

    it('should throw an error if adding library entries is not enabled', () => {
      assert.throws(
        () => {
          reactTest.ref.current.addLibraryEntry('src.com/1.jpeg');
        },
        OperationNotEnabled
      );
    });

    it('should call addLibraryEntry on backend if enabled', () => {
      sinon.replace(reactTest.backend, 'addLibraryEntry', sinon.fake());
      act(() => {
        reactTest.ref.current.enableAddingLibraryEntries('api.com');
      });
      reactTest.ref.current.addLibraryEntry('src.com/1.jpeg');
      assert.calledOnceWith(
        reactTest.backend,
        'addLibraryEntry',
        'api.com',
        'src.com/1.jpeg'
      );
    });

  });

  it('should read add-library-entry link', () => {
    let homePage = reactTest.ref.current;
    act(() => {
      homePage.readResource({links: [{
        rel: 'add-library-entry',
        href: 'https://api.com/collection'
      }]});
    });
    assert.equal(homePage.state.relAddLibraryEntry, 'https://api.com/collection');
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

    it('should call addLibraryEntry callback when URL submitted', () => {
      sinon.replace(reactTest.ref.current, 'addLibraryEntry', sinon.fake());
      act(() => {
        reactTest.ref.current.enableAddingLibraryEntries('api.com/images');
      });
      simulateClick(reactTest.document, '.from-web');
      reactTest.document.querySelector(urlInputSelector).value = 'https://images.com/image.jpeg';
      simulateClick(reactTest.document, 'input.submit-library-entry');
      assert.calledOnceWith(reactTest.ref.current, 'addLibraryEntry', 'https://images.com/image.jpeg');
    });

    // Unfortunately, as far as I can tell, testing this is impossible because
    // file inputs are read only, so we can't put in a test value. If anyone
    // knows how to get around this, I'm all ears.
    it('should call addLibraryEntry callback when file submitted');

  });

  describe('search', () => {

    it('should render', () => {
      assert.rendered(reactTest.document, 'form.search');
    });

    it('should contain a text input', () => {
      let search = reactTest.document.querySelector('form.search');
      let input = search.querySelector('input.query-input');
      assert.ok(input, 'Input not rendered');
      assert.equal(input.type, 'text', 'Input type is not "text"');
    });

    it('should contain a submit button', () => {
      let search = reactTest.document.querySelector('form.search');
      let input = search.querySelector('input.submit-search');
      assert.ok(input, 'Submit button not rendered');
      assert.equal(input.type, 'submit', 'Input type is not "submit"');
    });

  });

});
