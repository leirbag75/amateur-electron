import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import HomePage from '../src/home-page';
import assert from './assertions';
import { describeComponent, assertCalledOnceWith  } from './test-helpers';

describeComponent(HomePage, reactTest => {

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
    let thumbnails = document.querySelector('.thumbnails').children;
    for(let i = 0; i < thumbnailObjects.length; ++i)
      assert.equal(
        thumbnails[i].src,
        thumbnailObjects[i].embed.src
      );
  });

});
