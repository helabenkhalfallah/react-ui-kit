const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line prefer-destructuring
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader', },
          { loader: 'css-loader', },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true, // This is important!
            },
          },
        ],
      },
      // Tell the DEFAULT sass-rule to ignore being used for sass imports in less files (sounds weird)
      {
        test: /\.scss$/,
        issuer: {
          exclude: /\.less$/,
        },
        // ... other settings
      },
      // Define a second rule for only being used from less files
      // This rule will only be used for converting our sass-variables to less-variables
      {
        test: /\.scss$/,
        issuer: /\.less$/,
        use: {
          loader: './sassVarsToLess.js', // Change path if necessary
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '*',
      '.js',
      '.jsx',
    ],
    alias: {
      '@ant-design/icons/lib/dist$': path.resolve(__dirname, './components/icons/icons.js'),
      moment: 'moment/moment.js',
    },
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hello Webpack bundled JavaScript Project',
      template: './public/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fr/),
  ],
  devServer: {
    port: 9000,
    contentBase: './dist',
    hot: true,
  },
  target: 'web',
};
