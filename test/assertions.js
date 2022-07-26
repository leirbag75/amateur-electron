import { strict as assert } from 'assert';

function calledOnceWith(object, field, ...args) {
  assert.ok(object[field].calledOnce, `"${field}" not called once`);
  assert.ok(
    object[field].calledWith(...args), `"${field}" called with wrong arguments`
  );
}

export default { ...assert, calledOnceWith };
