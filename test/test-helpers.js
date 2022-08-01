import { describe, it } from 'mocha';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';
import { strict as assert } from 'assert';
import sinon from 'sinon';

export class ReactTest {

  start() {
    this.backend = {loadResource: sinon.fake()};
    this.ref = React.createRef();
    let dom = new JSDOM('<!DOCTYPE html><body><div id="root"></div></body>');
    this.originalWindow = global.window;
    global.window = dom.window;
    this.document = dom.window.document;
  }

  finish() {
    global.window = this.originalWindow;
  }

  render(componentClass, props, ref = this.ref) {
    let component = React.createElement(
      componentClass,
      {...props, ref: ref}
    );
    act(() => {
      let root = createRoot(this.document.getElementById('root'));
      root.render(component);
    });
  }

}

export function describeComponent(descriptionString, testFunction) {

  let reactTest = new ReactTest();

  describe(descriptionString, () => {

    beforeEach(() => {
      reactTest.start();
    });

    afterEach(() => {
      reactTest.finish();
    });

    testFunction(reactTest);

  });

}

export function simulateClick(document, selector) {
  let element = document.querySelector(selector);
  act(() => {
    element.dispatchEvent(new window.MouseEvent('click', {bubbles: true}));
  });
}
