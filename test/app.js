import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import App from '../src/app';
import HomePage from '../src/home-page';
import { strict as assert } from 'assert';
import { describeComponent  } from './react-test';
import React from 'react';

class MockPage extends React.Component {

  render() {
    return <div id="mock-div" />;
  }

}

describeComponent('App', reactTest => {

  describe('page switching behavior', () => {

    let app;

    beforeEach(() => {
      reactTest.render(App, {});
      app = reactTest.ref.current;
    });

    it('should start on home page', () => {
      assert.equal(reactTest.ref.current.currentPage, HomePage)
    });

    it('should switch pages', () => {
      act(() => {
        app.setPage(MockPage);
      });
      assert.equal(app.currentPage, MockPage);
    });

    it('should render the selected page', () => {
      act(() => {
        app.setPage(MockPage);
      });
      let mockDiv = reactTest.document.getElementById('mock-div');
      assert.ok(mockDiv, 'Selected page not rendered');
    });

  });

})
