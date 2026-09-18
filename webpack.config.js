const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = ['chrome', 'firefox'].map(browser => ({
  name: browser,
  entry: {
    background: './src/background.js',
    home: './src/home.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist', browser),
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
      {
        from: 'manifest.json', to: './',
        transform(content) {
          if (browser !== 'firefox') return content;
          const manifest = JSON.parse(content.toString());
          manifest.background = { scripts: ['./background.js'] };
          manifest.browser_specific_settings = {
            gecko: {
              id: 'delay-firefox@richardroy',
              strict_min_version: '140.0',
              data_collection_permissions: {
                required: ['none']
              }
            }
          };
          delete manifest.incognito;
          return JSON.stringify(manifest, null, 2);
        }
      },
      { from: 'icon.png', to: './' },
    ]),
  ]
}));
