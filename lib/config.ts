export default {
	v1: {
		get url() {
			let v1Url = process.env['V1_URL'];
			const v1UrlDefault = "http://localhost/VersionOne.Web";

			if (!v1Url || v1Url === '') {
				v1Url = v1UrlDefault;
			}

			return v1Url.replace(/\/$/, '');
		},

		get username() {
			return process.env['V1_USERNAME'] || 'admin';
		},

		get password() {
			return process.env['V1_PASSWORD'] || 'admin';
		},

		get server() {
			let urlParts = this.url.match(/\/\/(.+)\/(.*)/);
			return urlParts[1];
		},

		get instance() {
			let urlParts = this.url.match(/\/\/(.+)\/(.*)/);
			return urlParts[2];
		}
	},

	get concurrentTests() {
		return process.env['CONCURRENT_TESTS'] ? parseInt(process.env['CONCURRENT_TESTS']) : 1;
	}
};