const path = require('path');

module.exports = {
  entry: './src/assets/js/main.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'public/assets/js'),
    filename: 'kanban.min.js',
    clean: true,
  },
  experiments: {
    topLevelAwait: true
  }
};