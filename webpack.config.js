module.exports = {
  entry: {
    background: './src/background.js',
    home: './src/Home.js'
  },
  output: {
    filename: './build/[name].js'
  },
  target: 'web',
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};