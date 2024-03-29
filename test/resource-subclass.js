import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import Resource from '../src/resource';
import assert from './assertions';
import { withReactTest, url } from './test-helpers';

export default function addResourceTests(
  resourceClass,
  description = 'as Resource'
) {

  withReactTest(description, reactTest => {

    describe('componentDidMount', () => {

      let ref;

      beforeEach(() => {
        ({ ref } = reactTest);
      });

      describe('embedded', () => {

        let embed = {};

        // Needed to test that a method is called on "this" in
        // componentDidMount. Normally, we can only use sinon.replace after
        // refs are assigned, which is already after componentDidMount is
        // finished. So to test that a method on "this" is called in
        // componentDidMount, we have to use inheritance to override that
        // member with a mock before refs are assigned.
        class MockResource extends resourceClass {
          readResource = sinon.fake();
        }

        beforeEach(() => {
          reactTest.render(MockResource, {url, embed});
        });

        it('should call readResource on "embed" prop', () => {
          assert.calledOnceWith(
            ref.current,
            'readResource',
            embed
          );
        });

      });

      describe('base case', () => {

        // Needed to test that a method is called in componentDidMount; see
        // above
        class MockResource extends resourceClass {
          refresh = sinon.fake();
        }

        beforeEach(() => {
          reactTest.render(MockResource, {url});
        });

        it('should call refresh after mounting', () => {
          assert.calledOnceWith(ref.current, 'refresh');
        });

      });

      describe('refresh', () => {

        beforeEach(() => {
          reactTest.render(resourceClass, {url});
          let loadResource = sinon
            .fake
            .returns({
              then: sinon.fake()
            });
          sinon.replace(reactTest.backend, 'loadResource', loadResource);
          ref.current.refresh();
        });

        it('should call loadResource on the backend', () => {
          assert.calledOnceWith(
            reactTest.backend,
            'loadResource',
            url
          );
        });

        it(
          'should pass readResource to the promise returned by loadResource',
          () => {
            assert.calledOnceWith(
              reactTest.backend.loadResource(),
              'then',
              ref.current.readResource
            );
          }
        );

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
            assert.calledOnceWith(reader, 'read', resource, viewer);
        });
      })
    });

  });

}
