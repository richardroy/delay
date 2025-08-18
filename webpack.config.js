const CopyWebpackPlugin = require('copy-webpack-plugin');

const commonRules = [
  { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
];

const commonResolve = { extensions: ['.js'] };

module.exports = [
  {
    name: 'worker',
    entry: { background: './src/background.js' },
    output: {
      filename: './[name].js',
      publicPath: '',         // prevent runtime from probing document.currentScript
      globalObject: 'self'    // safe global in workers
    },
    target: 'webworker',
    resolve: commonResolve,
    module: { rules: commonRules },
  },
  {
    name: 'pages',
    entry: { home: './src/home.js', delay: './src/delay.js' },
    output: { filename: './[name].js' },
    target: 'web',
    resolve: commonResolve,
    module: { rules: commonRules },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'src/home.html', to: './' },
        { from: 'src/background.html', to: './' },
        { from: 'src/style.css', to: './' },
        { from: 'manifest.json', to: './' },
        { from: 'icon.png', to: './' },
      ]),
    ]
  }
];