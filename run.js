var Blessify = require('./index.js');

var config_path = 'config.yml';
var stylesheet_name = 'styles.scss.css';
var output_path = './css';

var blessify = new Blessify(config_path, stylesheet_name, output_path, false, function (output_files) {
  console.log(output_files);
});
