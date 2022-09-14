import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import App from '../src/app';
import HomePage from '../src/home-page';
import assert from './assertions';
import { describeComponent, simulateClick  } from './test-helpers';
import React from 'react';

class MockPage extends React.Component {

  render() {
    return <div id="mock-div" />;
  }

}

describeComponent(App, reactTest => {

  let app;

  beforeEach(() => {
    app = reactTest.ref.current;
  });

  describe('page switching behavior', () => {

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

  describe('page history', () => {

    it('should track the number of pages previously visited', () => {
      assert.equal(app.pagesVisited.length, 0);
      act(() => {
        app.setPage(<MockPage />);
      })
      assert.equal(app.pagesVisited.length, 1);
    });

    it('should set the page back to its original value when popped', () => {
      let originalPage = app.currentPage;
      act(() => {
        app.setPage(<MockPage />);
        app.goBack();
      });
      assert.equal(originalPage, app.currentPage);
    });

  });

  describe('back button', () => {

    it('should render if previously visited page exists', () => {
      assert.notRendered(reactTest.document, '.back-button');
      act(() => {
        app.setPage(<MockPage />);
      });
      assert.rendered(reactTest.document, '.back-button');
    });

    it('should call "goBack" when clicked', () => {
      sinon.replace(app, 'goBack', sinon.fake());
      act(() => {
        app.setPage(<MockPage />);
      });
      simulateClick(reactTest.document, '.back-button');
      assert.ok(app.goBack.calledOnce, '"goBack" not called');
    });

  });

})
