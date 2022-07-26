import { strict as assert } from 'assert';

function calledOnceWith(object, field, ...args) {
  assert.ok(object[field].calledOnce, `"${field}" not called once`);
  assert.ok(
    object[field].calledWith(...args), `"${field}" called with wrong arguments`
  );
}

function rendered(
  document,
  selector,
  message =  `No element matching selector ${selector} rendered.`
) {
  let element = document.querySelector(selector);
  assert.ok(element, message);
}

export default { ...assert, calledOnceWith, rendered };
