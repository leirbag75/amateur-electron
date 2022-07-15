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

  });

});
