var mongoose = require('mongoose');
var config = require('../config');
var fs = require('fs');
var log = require('./../libs/log');

mongoose.connect(config.connectionstring);

var db = mongoose.connection;
db.on('error', function(err){
    console.error('connect to %s error: ', config.connectionstring, err.message);
    process.exit(1);
});
db.once('open', function () {
    log.success('%s has been connected.', config.connectionstring);
});

var models_path = __dirname + '/../models/mapping';
require(models_path + '/' + 'PicturesModel.js');
require(models_path + '/' + 'UsersModel.js');
exports['Pictures'] = mongoose.model('Pictures');
exports['Vehicles'] = mongoose.model('Vehicles');
exports['Users'] = mongoose.model('Users');
// fs.readdirSync(models_path).forEach(function (file) {
//     require(models_path + '/' + file);
//     var modelName = file.replace('Model.js', '');
//     exports[modelName] = mongoose.model(modelName);
// });
