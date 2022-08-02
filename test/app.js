import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import App from '../src/app';
import HomePage from '../src/home-page';
import { strict as assert } from 'assert';
import { describeComponent  } from './test-helpers';
import React from 'react';

class MockPage extends React.Component {

  render() {
    return <div id="mock-div" />;
  }

}

describeComponent(App, reactTest => {

  describe('page switching behavior', () => {

    let app;

    beforeEach(() => {
      reactTest.render(App, {});
      app = reactTest.ref.current;
    });

    it('should start on home page', () => {
      assert.equal(reactTest.ref.current.currentPage.type, HomePage)
    });

    it('should switch pages', () => {
      let component = <MockPage />
      act(() => {
        app.setPage(component);
      });
      assert.equal(app.currentPage, component);
    });

    it('should render the selected page', () => {
      let component = <MockPage />
      act(() => {
        app.setPage(component);
      });
      let mockDiv = reactTest.document.getElementById('mock-div');
      assert.ok(mockDiv, 'Selected page not rendered');
    });

  });

})
