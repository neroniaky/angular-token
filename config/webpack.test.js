const helpers = require('./helpers');
const path = require('path');

const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

module.exports = function (options) {
    return {

        devtool: 'inline-source-map',

        resolve: {
            extensions: ['.ts', '.js'],
            modules: [ path.resolve(__dirname, 'src'), 'node_modules' ]
        },

        module: {

            rules: [

                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'source-map-loader',
                    exclude: [
                        helpers.root('node_modules/rxjs'),
                        helpers.root('node_modules/@angular')
                    ]
                }, {
                    test: /\.ts$/,
                    loader: 'awesome-typescript-loader',
                    query: {
                        sourceMap: false,
                        inlineSourceMap: true,
                        compilerOptions: {
                        removeComments: true
                        }
                    },
                    exclude: [/\.e2e\.ts$/]
                }, {
                    enforce: 'post',
                    test: /\.(js|ts)$/,
                    loader: 'istanbul-instrumenter-loader',
                    include: helpers.root('src'),
                    exclude: [
                        /\.(e2e|spec)\.ts$/,
                        /node_modules/
                    ]
                }
            ]
        },

        plugins: [

            new ContextReplacementPlugin(
                    /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
                    helpers.root('src')
                ),
                new LoaderOptionsPlugin({
                debug: true,
                options: { }
            }),
        ],

        node: {
            global: true,
            process: false,
            crypto: 'empty',
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };
}