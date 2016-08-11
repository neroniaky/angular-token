module.exports = function (config) {
	var testWebpackConfig = require('./webpack.test.js');

	var configuration = {

		basePath: '',
		frameworks: ['jasmine'],
		exclude: [],
		files: [{ pattern: './config/spec-bundle.js', watched: false }],
		preprocessors: { './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'] },
		webpack: testWebpackConfig,

		coverageReporter: {
			dir: 'coverage/',
			reporters: [
				{ type: 'text-summary' },
				{ type: 'json' },
				{ type: 'html' }
			]
		},

		webpackServer: { noInfo: true },
		reporters: ['mocha', 'coverage'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,

		browsers: [
			'Chrome'
		],

		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},

		singleRun: true
	};

	if (process.env.TRAVIS) {
		configuration.browsers = ['Chrome_travis_ci'];
	}

	config.set(configuration);
};
