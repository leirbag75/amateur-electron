import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import HomePage from '../src/home-page';
import assert from './assertions';
import {
  describeComponent,
  assertCalledOnceWith,
  thumbnailSelector,
  thumbnailSrc
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

});
