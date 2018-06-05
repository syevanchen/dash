import path from 'path';
import webpack from 'webpack';
import extend from 'extend';
import AssetsPlugin from 'assets-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const AUTOPREFIXER_BROWSERS = [
	'Android 2.3',
	'Android >= 4',
	'Chrome >= 35',
	'Firefox >= 31',
	'Explorer >= 9',
	'iOS >= 7',
	'Opera >= 12',
	'Safari >= 7.1',
];
const GLOBALS = {
	'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
	__DEV__: DEBUG,
};

const config = {
	output: {
		publicPath: '/',
		sourcePrefix: '  '
	},

	cache: DEBUG,
	debug: DEBUG,

	stats: {
		colors: true,
		reasons: DEBUG,
		hash: VERBOSE,
		version: VERBOSE,
		timings: true,
		chunks: VERBOSE,
		chunkModules: VERBOSE,
		cached: VERBOSE,
		cachedAssets: VERBOSE,
	},

	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
	],

	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
	},

	module: {
		loaders: [{
			test: /\.jsx?$/,
			include: [
				path.resolve(__dirname, '../src')
			],
			loader: 'babel-loader',
		}, {
			test: /\.scss$/,
			loaders: [
				'style-loader',
				`css-loader?${DEBUG ? 'sourceMap&' : 'minimize&'}modules&localIdentName=` +
				`${DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]'}`,
				'postcss-loader?parser=postcss-scss'
			],
		}, {
			test: /\.json$/,
			loader: 'json-loader',
		}, {
			test: /\.txt$/,
			loader: 'raw-loader',
		}, {
			test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
			loader: 'url-loader?limit=10000',
		}, {
			test: /\.(eot|ttf|wav|mp3)$/,
			loader: 'file-loader',
		}, {
			test: /\.jade$/,
			loader: 'jade-loader',
		}, ],
	},

	postcss: function plugins(bundler) {
		return [
			require('postcss-import')({
				addDependencyTo: bundler
			}),
			require('precss')(),
			require('autoprefixer')({
				browsers: AUTOPREFIXER_BROWSERS
			}),
		];
	},
};

const clientConfig = extend(true, {}, config, {
	entry: './src/main.js',
	output: {
		path: path.join(__dirname, '../build/public'),
		filename: '[name].js?[hash]',
	},
	devtool: DEBUG ? 'source-map' : false,
	plugins: [
		...config.plugins,
		new webpack.DefinePlugin({...GLOBALS,
			'process.env.BROWSER': true
		}),
		new AssetsPlugin({
			path: path.join(__dirname, '../build'),
			filename: 'assets.js',
			processOutput: x => `module.exports = ${JSON.stringify(x)};`,
		}),
		...(!DEBUG ? [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					screw_ie8: true,
					warnings: VERBOSE,
				},
			}),
			new webpack.optimize.AggressiveMergingPlugin(),
		] : []),
	],
});

export default clientConfig;