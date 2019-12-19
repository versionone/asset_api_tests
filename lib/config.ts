let haveReportedDefault = false;

export default {
	lifecycle: {
		get url() {
			let lifecycleUrl = process.env['LIFECYCLE_URL'];
			const lifecycleUrlDefault = "http://localhost/VersionOne.Web";

			if (!lifecycleUrl || lifecycleUrl === '') {
				if (!haveReportedDefault) {
					console.log(`LIFECYCLE_URL env variable not found, defaulting to ${lifecycleUrlDefault}`);
					haveReportedDefault = true;
				}
				lifecycleUrl = lifecycleUrlDefault;
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

	get concurrentTests() {
		return process.env['CONCURRENT_TESTS'] ? parseInt(process.env['CONCURRENT_TESTS']) : 1;
	}
};