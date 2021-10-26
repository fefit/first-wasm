
const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = (curPath) => path.resolve(__dirname, curPath);
const jsExtName = '.js';
const tmplExtName = '.html';
const { htmlWebpackPlugins, entry } = (() => {
  const files = glob.sync(resolve(`src/js/*${jsExtName}`));
  const template = resolve('src/template/index.html');
  const entry = {};
  const htmlWebpackPlugins = files.map((file) => {
    const name = path.basename(file, tmplExtName);
    return new HtmlWebpackPlugin({
      chunks: ['common', name],
      template,
      filename: resolve(`examples/${name}.html`),
      inject: true
    });
  });
  return { entry, htmlWebpackPlugins }
})();

module.exports = {
  entry,
  output: {
    path: resolve('dist/'),
    filename: 'js/[name].js',
    publicPath: '/dist/'
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      verbose: true
    }),
    ...htmlWebpackPlugins
  ],
  module: {
    rules: [{
      test: /\.js/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /\.wast$/,
      loader: "wast-loader",
      type: "webassembly/experimental"
    }]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'initial',
          minChunks: 2,
        }
      }
    }
  }
};