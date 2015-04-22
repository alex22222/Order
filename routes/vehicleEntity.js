var VehicleEntityModel = require("./../models").VehicleEntity;
var helper = require('./helper');
var fs = require('fs');

exports.listVehicle = function(req, res) {
    var where = {};
    var level = req.query['level'];
    if (req.query['level']) {
        where = {
            level: level
        };
    }
    var search = req.query['search'];
    if (req.query['search']) {
        where = {
            title: search
        };
    }

    var pageNumber = req.query['pageNumber'];
    var itemsPerPage = req.query['itemsPerPage'];

    var skipFrom = (pageNumber * itemsPerPage) - itemsPerPage;
    var query = VehicleEntityModel.find(where).populate('children').skip(skipFrom).sort({
        '_id': -1
    }).limit(itemsPerPage);

    query.exec(function(error, results) {
        if (error) {
            // callback(error, null, null);
        } else {
            VehicleEntityModel.count(where, function(error, count) {
                if (error) {
                    // callback(error, null, null);
                } else {
                    var page = {
                        limit: 5,
                        num: 1
                    };
                    var pageCount = Math.ceil(count / itemsPerPage);
                    page['pageCount'] = pageCount;
                    page['currentPage'] = pageNumber;
                    page['size'] = count;
                    page['itemsPerPage'] = itemsPerPage;
                    var resultSet = {
                        vehicleList: results,
                        page: page,
						success: true
                    };
                    return res.json(resultSet);
                }
            });
        }
    });
};

exports.addVehicle = function(req, res) {
    var file = req.files.file;
    var target_path = './public/images/vehicle/' + req.files.file.name;
    var vehicleEntity = new VehicleEntityModel();
    vehicleEntity.title = req.body.title;
    vehicleEntity.description = req.body.description;
    vehicleEntity.children = [];

    var vv = new String(req.body.children);
    var _v = vv.split('|');
    for (var i = 0; i < _v.length - 1; i++) {
        var vid = _v[i];
        var ve = new VehicleEntityModel({
            _id: vid
        });
        vehicleEntity.children.push(ve);
    }



    vehicleEntity.level = req.body.level;
    vehicleEntity.name = file.name;
    vehicleEntity.size = file.size;
    vehicleEntity.type = file.type;
    vehicleEntity.path = target_path;

    vehicleEntity.save(function(err, vehicleEntity) {
        if (err) {
            res.json(helper.wrapUpdate(err));
        } else {
            res.json(helper.wrapUpdate());
        }
        if (file) {
            var tmp_path = req.files.file.path;
            fs.rename(tmp_path, target_path, function(err) {
                if (err) {
                    return res.json({
                        err: err
                    });
                }
                fs.unlink(tmp_path, function() {
                    if (err) res.json(helper.wrapUpdate(err));
                    res.json(helper.wrapUpdate());
                });
            });
        }
    });
};

exports.createVehicle = function(req, res) {
    var vehicle = new VehicleEntityModel();
    vehicle.title = req.body.title;
    vehicle.description = req.body.description;
    vehicle.level = req.body.level;
    vehicle.children = [];
    if (req.body.children) {
        for (var i = 0; i < req.body.children.length; i++) {
            var vid = req.body.children[i]._id;
            var ve = new VehicleEntityModel({
                _id: vid
            });
            vehicle.children.push(ve);
        }
    }

    vehicle.save(function(err, vehicle) {
        if (err) {
            res.json(helper.wrapAdd(err));
        } else {
            res.json(helper.wrapAdd());
        }
    });
};

exports.queryVehicle = function(req, res) {
    var id = req.query['comId'];
    var condition = {
        _id: id
    };
    VehicleEntityModel.find(condition).populate('children').exec(function(err, vehicle) {
        if (err) {
            res.json(helper.wrapQuery(err));
        } else {
            if (vehicle.length != 1) {
                res.json(helper.wrapQuery('没有相关数据！'));
            } else {
                res.json(vehicle[0]);
            }
        }
    });
};

exports.updateVehicle = function(req, res) {
    var v = req.body;
    // var vehicle = new VehicleEntityModel(v);
    VehicleEntityModel.findById(req.body._id).populate('children').exec(function(err, vehicle) {
        if (err) return res.json(helper.wrapUpdate(err));
        vehicle.title = v.title;
        vehicle.description = v.description;
        vehicle.children = v.children;
        vehicle.level = v.level;
        vehicle.save(function(err, vehicle) {
            if (err) {
                res.json(helper.wrapUpdate(err));
            } else {
                res.json(helper.wrapUpdate());
            }
        });
    });
};

exports.deleteVehicle = function(req, res) {
    var id = req.query['vehicleId'];
    var condition = {
        _id: id
    };
    VehicleEntityModel.remove(condition, function(err) {
        if (err) {
            res.json(helper.wrapDelete(err));
        } else {
            res.json(helper.wrapDelete());
        }
    });
};

exports.deletePicture = function(req, res) {
    var id = req.query['vehicleId'];
    VehicleEntityModel.findById(id, function(err, vehicle) {
        if (err) return res.json(helper.wrapUpdate(err));
        vehicle.path = '';
        vehicle.name = '';
        vehicle.save(function(err, vehicle) {
            if (err) {
                res.json(helper.wrapUpdate(err));
            } else {
                res.json(helper.wrapUpdate());
            }
        });
    });
};