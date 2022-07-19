import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import Resource from '../src/resource';
import { strict as assert } from 'assert';
import { describeComponent, assertCalledOnceWith  } from './react-test';
import addResourceTests from './resource-subclass';

addResourceTests(Resource, 'Resource');
