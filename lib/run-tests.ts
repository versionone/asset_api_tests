import {spawn} from 'child_process';
import * as path from 'path';
import * as kill from 'tree-kill';
import * as watch from 'watch-pid';
import * as getPpid from 'parent-process-pid';

const avaExe = process.platform === 'win32' ? path.resolve('node_modules/.bin/ava.cmd') : path.resolve('node_modules/.bin/ava.cmd');
const concurrency: string = (process.env['CONCURRENCY'] ? parseInt(process.env['CONCURRENCY']) : 1).toString();
let avaProcess;

let testPath = process.argv[2] || "tests";
let testName = process.argv[3] || "*";
let flow: any = Promise.resolve();

console.log(`Running these tests: ${testPath}/${testName}`);

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

if (process.platform === 'win32') {
	getPpid(process.pid).then(ppid => {
		watch(ppid, pid => {
			kill(process.pid);
		});
	});
}
