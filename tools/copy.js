import path from 'path';
import gaze from 'gaze';
import Promise from 'bluebird';

async function copy({
	watch
} = {}) {
	const ncp = Promise.promisify(require('ncp'));

	await Promise.all([
		ncp('src/public', 'build/public'),
		ncp('package.json', 'build/package.json'),
	]);

	if (watch) {
		const watcher = await new Promise((resolve, reject) => {
			gaze('src/public/**/*.*', (err, val) => err ? reject(err) : resolve(val));
		});
		watcher.on('changed', async(file) => {
			const relPath = file.substr(path.join(__dirname, '../src/public/').length);
			await ncp(`src/public/${relPath}`, `build/public/${relPath}`);
		});
	}
}

export default copy;