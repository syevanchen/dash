import del from 'del';
import fs from './lib/fs';

async function remove() {
	await del(['build/public/api', 'build/public/data'], {
		dot: true
	});
}

export default remove;