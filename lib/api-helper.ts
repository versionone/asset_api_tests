import * as chai from 'chai';
import Axios from 'axios';
import * as chaiAsPromised from 'chai-as-promised';
import * as chaiDatetime from 'chai-datetime';
import anyTest, {TestInterface} from 'ava';
import V1Api from './v1_api';
import * as btoa from 'btoa';
import config from './config';

chai.use(chaiAsPromised);
chai.use(chaiDatetime);

const test = anyTest as TestInterface<{apiThroatResolve: Function }>;
const baseUrl = config.v1.url;
const concurrentTests = process.env['CONCURRENT_TESTS'] ? parseInt(process.env['CONCURRENT_TESTS']) : 1;

const v1Api = new V1Api(config.v1);
const api = v1Api;


let axios = Axios.create({
	baseURL: config.v1.url,
	timeout: 30000,
	headers: {
		'Authorization': 'Basic ' + btoa(config.v1.username + ':' + config.v1.password)
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

export {test, config, api, v1Api, baseUrl, axios};

