import { describe, it } from 'mocha';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

export class ReactTest {

  start() {
    this.backend = {};
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

