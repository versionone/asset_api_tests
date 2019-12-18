import {axios, test} from './api-helper';

const assetApiPost = async (data : string, contentTypeShorthand='yaml') => {
	let contentType = contentTypeShorthand === 'yaml' ? 'text/yaml' : 'application/json';
	return axios.post('/api/asset', data, { headers: {'Content-Type': contentType}, timeout: 180000 });
};

export {test, assetApiPost};