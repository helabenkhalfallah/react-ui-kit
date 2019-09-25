const webpack = require('webpack');
const path = require('path');

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'react-ui-h-kit.js',
    libraryTarget: 'commonjs2'
  },
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
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fr/),
  ],
  externals: {
    // Don't bundle react or react-dom      
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  }
};
