import { describe, it } from 'mocha';
import sinon from 'sinon';
import * as readers from '../src/readers';
import assert from './assertions';

describe('readers', () => {

  describe('FieldReader', () => {

    it('should read a given field and call the corresponding method', () => {
      let viewer = {setSrc: sinon.fake()};
      let reader = new readers.FieldReader('src', 'setSrc');
      reader.read({src: 'blah'}, viewer);
      assert.calledOnceWith(viewer, 'setSrc', 'blah');
    });

    it('should not call the method if the field does not exist', () => {
      let reader = new readers.FieldReader('src', 'nonexistent');
      reader.read({}, {});
    });

    it('should call the method even if the value is falsey', () => {
      let viewer = {setLikes: sinon.fake()};
      let reader = new readers.FieldReader('likes', 'setLikes');
      reader.read({likes: 0}, viewer);
      assert.calledOnceWith(viewer, 'setLikes', 0);
    });

  });

  describe('LinkReader', () => {

    it('should call the given method on the link with the given rel', () => {
      let viewer = {enableLiking: sinon.fake()};
      let link = {rel: 'like', href: 'api.com/like'};
      let reader = new readers.LinkReader('like', 'enableLiking');
      reader.read({links: [link]}, viewer);
      assert.calledOnceWith(viewer, 'enableLiking', link.href);
    });

    it('should not call the method if the link does not exist', () => {
      let reader = new readers.LinkReader('like', 'nonexistent');
      reader.read({links: []}, {});
    });

  });

  describe('LinkListReader', () => {

    it('should call the method with all links of the given rel', () => {
      let viewer = {setTags: sinon.fake()};
      let reader = new readers.LinkListReader('tag', 'setTags');
      let links = [
        {rel: 'tag', href: 'api.com/tags/1'},
        {rel: 'tag', href: 'api.com/tags/2'}
      ];
      reader.read({links: links}, viewer);
      assert.ok(viewer.setTags.calledOnce, 'setTags not called once');
      let args = viewer.setTags.getCall(0).args;
      for(let i = 0; i < links.length; ++i)
        assert.equal(args[0][i], links[i]);
    });

    it('should not call the method if no links are found', () => {
      let reader = new readers.LinkListReader('tag', 'nonexistent');
      reader.read({links: []}, {});
    });

  });

});
