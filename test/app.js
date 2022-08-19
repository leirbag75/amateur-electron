import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import App from '../src/app';
import HomePage from '../src/home-page';
import assert from './assertions';
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
      app = reactTest.ref.current;
    });

    it('should start on home page', () => {
      assert.equal(app.currentPage.type, HomePage)
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
