module.exports = {
  entry: {
    background: './background.js',
    home: './Home.js'
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