module.exports = {

	devtool: 'inline-source-map',

	resolve: {
		extensions: ['', '.ts', '.js'],
		root: '../src',
	},

	module: {
		preLoaders: [{
			test: /\.js$/,
			loader: 'source-map-loader',
			exclude: [
				'../node_modules/rxjs',
				'../node_modules/@angular'
			]
		}],
		loaders: [{
			test: /\.ts$/,
			loader: 'awesome-typescript-loader',
			query: {
				compilerOptions: {
					removeComments: true
				}
			},
			exclude: [/\.e2e\.ts$/]
		}],
		postLoaders: [{
			test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
			include: '../src',
			exclude: [
				/\.(e2e|spec)\.ts$/,
				/node_modules/
			]
		}]
	},

	node: {
		global: 'window',
		process: false,
		crypto: 'empty',
		module: false,
		clearImmediate: false,
		setImmediate: false
	}
};
