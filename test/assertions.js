import { strict as assert } from 'assert';

function calledOnceWith(object, field, ...args) {
  assert.ok(object[field].calledOnce, `"${field}" not called once`);
  let givenArgs = object[field].getCall(0).args;
  for(let i = 0; i < args.length; ++i)
    assert.equal(givenArgs[i], args[i]);
}

function rendered(
  document,
  selector,
  message =  `No element matching selector ${selector} rendered.`
) {
  let element = document.querySelector(selector);
  assert.ok(element, message);
}

function notRendered(
  document,
  selector,
  message =  `Element matching ${selector} was rendered.`
) {
  let element = document.querySelector(selector);
  assert.ok(!element, message);
}

export default { ...assert, calledOnceWith, rendered, notRendered };
