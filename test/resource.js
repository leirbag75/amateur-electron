import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import Resource from '../src/resource';
import { strict as assert } from 'assert';
import { describeComponent, assertCalledOnceWith  } from './react-test';

describeComponent('Resource', reactTest => {

  describe('componentDidMount', () => {

    let backend, ref, url = 'https://api.com/resources/1';

    beforeEach(() => {
      ({ backend, ref } = reactTest);
      backend.loadResource = sinon.fake();
      reactTest.render(Resource, {url, backend});
    });

    it('should call loadResource on the backend', () => {
      assertCalledOnceWith(
        backend,
        'loadResource',
        url,
        ref.current.readResource
      );
    });

    it('should call read on all readers', () => {
      let viewer = ref.current;
      assert.equal(typeof viewer.readers, 'function');
      function fakeReader() {
        return {read: sinon.fake()};
      }
      let readers = [fakeReader(), fakeReader(), fakeReader()];
      let resource = {};
      sinon.replace(viewer, 'readers', sinon.fake.returns(readers));
      viewer.readResource(resource);
      for(let reader of readers)
        assertCalledOnceWith(reader, 'read', resource, viewer);
    });

  });

});
