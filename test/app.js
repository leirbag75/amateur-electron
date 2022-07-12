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

    beforeEach(() => {
      reactTest.render(App, {});
    });

    it('should start on home page', () => {
      assert.equal(reactTest.ref.current.currentPage, HomePage)
    });

    it('should switch pages', () => {
      let app = reactTest.ref.current
      act(() => {
        app.setPage(MockPage);
      });
      assert.equal(app.currentPage, MockPage);
    });

  });

})
