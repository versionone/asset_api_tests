import * as chai from 'chai';
import Axios from 'axios';
import * as chaiAsPromised from 'chai-as-promised';
import * as chaiDatetime from 'chai-datetime';
import anyTest, {TestInterface} from 'ava';
import LifecycleApi from './lifecycle_api';
import * as btoa from 'btoa';
import config from './config';

chai.use(chaiAsPromised);
chai.use(chaiDatetime);
//chai.should();

const test = anyTest as TestInterface<{apiThroatResolve: Function }>;
const baseUrl = config.lifecycle.url;
const concurrentTests = process.env['CONCURRENT_TESTS'] ? parseInt(process.env['CONCURRENT_TESTS']) : 1;

const lifecycleApi = new LifecycleApi(config.lifecycle);
const api = lifecycleApi;


let axios = Axios.create({
	baseURL: config.lifecycle.url,
	timeout: 30000,
	headers: {
		'Authorization': 'Basic ' + btoa(config.lifecycle.username + ':' + config.lifecycle.password)
	}
});

let throat = require('throat')(concurrentTests);

test.beforeEach(t => {
	return new Promise(beforeEachResolve => {
		return throat(() => {
			return new Promise((resolve) => {
				t.context.apiThroatResolve = resolve;

				beforeEachResolve();
			});
		});
	});
});

test.afterEach.always(t => {
	return t.context.apiThroatResolve();
});

export {test, config, api, lifecycleApi, baseUrl, axios};

