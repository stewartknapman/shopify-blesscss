var Blessify = require('./index.js');

var config_path = 'config.yml';
var stylesheet_name = 'styles.scss.css';
var output_path = './css';

new Blessify(config_path, stylesheet_name, output_path);