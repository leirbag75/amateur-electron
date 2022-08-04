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

  });

});
