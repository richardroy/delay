const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    background: './src/background.js',
    home: './src/home.js'
  },
  output: {
    filename: './[name].js'
  },
  target: 'web',
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/home.html', to: './' },
      { from: 'src/background.html', to: './' },
      { from: 'src/style.css', to: './' },
      { from: 'manifest.json', to: './' },
      { from: 'icon.png', to: './' },
    ]),
  ]
};