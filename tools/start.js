import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config';
import run from './run';
import clean from './clean';
import copy from './copy';

const DEBUG = !process.argv.includes('--release');

async function start() {
    await run(clean);
    await run(copy.bind(undefined, {
        watch: true
    }));
    await new Promise(resolve => {
        if (Array.isArray(webpackConfig.entry)) {
            webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080/');
        } else {
            webpackConfig.entry = ['webpack-dev-server/client?http://localhost:8080/', webpackConfig.entry];
        }

        webpackConfig.plugins.push(new webpack.NoErrorsPlugin());

        const bundler = webpack(webpackConfig);
        const server = new webpackDevServer(bundler, {
            inline: true,
            contentBase: "./build/public"
        });
        server.listen(8080);
    });
}

export default start;