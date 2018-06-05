import run from './run';
import clean from './clean';
import copy from './copy';
import remove from './remove';
import bundle from './bundle';

async function build() {
	await run(clean);
	await run(copy);
	await run(remove);
	await run(bundle);
}

export default build;