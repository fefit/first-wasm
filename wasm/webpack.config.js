
const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = (curPath) => path.resolve(__dirname, curPath);
const jsExtName = '.js';
const { htmlWebpackPlugins, entry } = (() => {
  const files = glob.sync(resolve(`src/js/*${jsExtName}`));
  const template = resolve('src/template/index.html');
  const entry = {};
  const htmlWebpackPlugins = files.map((file) => {
    const name = path.basename(file, jsExtName);
    entry[name] = file;
    return new HtmlWebpackPlugin({
      chunks: [name],
      template,
      filename: resolve(`examples/${name}.html`),
      inject: true,
      title: `${name}示例页面`
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
    // new CleanWebpackPlugin({
    //   dry: false,
    //   verbose: true
    // }),
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
      type: "webassembly/async"
    }]
  },
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true,
  }
};