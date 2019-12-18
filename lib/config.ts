export default {
	lifecycle: {
		get url() {
			let lifecycleUrl = process.env['LIFECYCLE_URL'];

			if (!lifecycleUrl || lifecycleUrl === '') {
				throw new Error('LIFECYCLE_URL not defined');
			}

			return lifecycleUrl.replace(/\/$/, '');
		},

		get username() {
			return process.env['LIFECYCLE_USERNAME'] || 'admin';
		},

		get password() {
			return process.env['LIFECYCLE_PASSWORD'] || 'admin';
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

	get headless() {
		return process.env['HEADLESS'] || false;
	},

	get browserName() {
		return process.env['BROWSER_NAME'] || 'chrome';
	},

	get concurrentTests() {
		return process.env['CONCURRENT_TESTS'] ? parseInt(process.env['CONCURRENT_TESTS']) : 1;
	}
};