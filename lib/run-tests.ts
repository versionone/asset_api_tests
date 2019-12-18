import {spawn} from 'child_process';
import * as fs from 'fs';
import * as findUp from 'find-up';
import * as glob from 'glob';
import * as path from 'path';
import * as seleniumStandalone from 'selenium-standalone';
import * as kill from 'tree-kill';
import * as watch from 'watch-pid';
import * as getPpid from 'parent-process-pid';

const avaExe = process.platform === 'win32' ? path.resolve('node_modules/.bin/ava.cmd') : path.resolve('node_modules/.bin/ava.cmd');
const concurrency: string = (process.env['CONCURRENCY'] ? parseInt(process.env['CONCURRENCY']) : 1).toString();
let avaProcess;

function installSelenium() {
	return new Promise(function (resolve, reject) {
		if (fs.existsSync('node_modules/selenium-standalone/.selenium'))
			return resolve();

		seleniumStandalone.install(function (err, result) {
			if (err) return reject(err);

			console.log('Selenium Installed');
			resolve();

		});
	});
}

let testPath = process.argv[2];
let testName = process.argv[3] || "*";
let testFiles = glob.sync(testPath, {absolute: true});
let testDir = fs.statSync(testFiles[0]).isDirectory() ? testFiles[0] : path.dirname(testFiles[0]);
let flow: any = Promise.resolve();

flow = flow
	.then(() => {
		let testPlanFile = findUp.sync('test-plan.js', {cwd: testDir});

		if (testPlanFile) {
			console.log("Found test plan file:", testPlanFile);
			testPath = testPlanFile;
		}
	})
	.then(() => {
		let beforeFile = findUp.sync('before.js', {cwd: testDir});

		if (beforeFile) {
			console.log('Found before file:', beforeFile);
			return require(beforeFile);
		}
	})
	.then(() => installSelenium());


flow = flow.then(() => {
	return new Promise(resolve => {

		avaProcess = spawn(avaExe, ['--verbose', '-c', concurrency, '--tap', '--match', testName, testPath], {
			env: process.env,
			stdio: 'inherit'
		});

		avaProcess.on('exit', function () {
			resolve();
		});
	});
});

flow.then(() => {
	let afterFile = findUp.sync('after.js', {cwd: testDir});

	if (afterFile) {
		console.log('Found after file:', afterFile);
		return require(afterFile);
	}
}).then(() => process.exit());

if (process.platform === 'win32') {
	getPpid(process.pid).then(ppid => {
		watch(ppid, pid => {
			kill(process.pid);
		});
	});
}
