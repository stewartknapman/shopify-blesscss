var fs = require('fs');
var yaml = require('js-yaml');
var bless = require('bless');
var request = require('request');

var Blessify = function (config_path, stylesheet_name, output_path) {
  this.stylesheet_name = stylesheet_name;
  this.output_path = output_path;
  this.config = this._get_config(config_path);
  this.asset_url = this._build_asst_url();

  this.bless = bless.Parser({ output: '', options: {}});
  
  // find the correct asset path so we can find the stylesheet in question.
  this.request_data(this.asset_url, function (data) {
    data = JSON.parse(data); // asset json data
    var asset_path = this._get_asset_path(data.assets[0].public_url);
    
    // Now we have the asset path lets get the stylesheet
    this._request_stylesheet(asset_path);
  });
};

Blessify.prototype.request_data = function (url, callback) {
  var _this = this;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback.apply(_this, [body]);
    }
  });
};

// Private

Blessify.prototype._get_config = function (config_path) {
  try {
    return yaml.safeLoad(fs.readFileSync(config_path, 'utf8'));
  } catch (e) {
    console.log(e);
  }
};

Blessify.prototype._build_asst_url = function () {
  return "https://"+this.config[':api_key']+":"+this.config[':password']+"@"+this.config[':store']+"/admin/themes/"+this.config[':theme_id']+"/assets.json";
};

Blessify.prototype._get_asset_path = function (path) {
  var asset_path = '';
  var path_parts = path.split('/');
  for (var i = 0; i < path_parts.length - 1; i++) {
    asset_path += path_parts[i] + '/';
  }
  return asset_path;
};

Blessify.prototype._request_stylesheet = function (asset_path) {
  var style_url = asset_path + this.stylesheet_name;
  this.request_data(style_url, function (data) {
    this._bless_stylesheet(data);
  });
};

Blessify.prototype._bless_stylesheet = function (css) {
  var blessed = this.bless.parse(css, function (err, files, numSelectors) {
    
    console.log(numSelectors, files.length);
    
  });
};

module.exports = Blessify;