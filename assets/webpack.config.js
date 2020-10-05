const path = require('path');
const glob = require('glob');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (_env, options) => {
  const devMode = options.mode !== 'production';

  return {
    optimization: {
      minimizer: [
        new TerserPlugin({ cache: true, parallel: true, sourceMap: devMode }),
      ]
    },
    entry: {
      'app': glob.sync('./vendor/**/*.js').concat(['./js/app.js']),
      'react': ['./frontend/react.js']
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../priv/static/js'),
      publicPath: '/js/'
    },
    devtool: devMode ? 'eval-cheap-module-source-map' : undefined,
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'ts-loader'
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".jsx"]
    },
    plugins: [
      new CopyWebpackPlugin([{ from: 'static/', to: '../' }]),
    ]
    .concat(devMode ? [new HardSourceWebpackPlugin()] : [])
  }
};
