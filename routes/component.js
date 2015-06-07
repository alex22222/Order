var ComponentModel = require("./../models").Component;
var PictureModel = require("./../models").Picture;
var fs = require('fs');
var helper = require('./helper');

exports.deleteComponent = function(req, res) {
    var id = req.query['comId'];
    var condition = {
        _id: id
    };
    ComponentModel.remove(condition, function(err) {
        if (err) {
            res.json(helper.wrapDelete(err));
        } else {
            res.json(helper.wrapDelete());
        }
    });
};

exports.listComponent = function(req, res) {
    var where = {};
    var search = req.query['search'];
    if (req.query['search']) {
        where = {
            comName: search
        };
    }

    var pageNumber = req.query['pageNumber'];
    var itemsPerPage = req.query['itemsPerPage'];

    var skipFrom = (pageNumber * itemsPerPage) - itemsPerPage;
    var query = ComponentModel.find(where).skip(skipFrom).sort({
        '_id': -1
    }).limit(itemsPerPage);

    query.exec(function(error, results) {
        if (error) {
            helper.wrapQuery(error);
        } else {
            ComponentModel.count(where, function(error, count) {
                if (error) {
                    helper.wrapQuery(error);
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
                        objectList: results,
                        page: page,
                        success: true
                    };
                    return res.json(resultSet);
                }
            });
        }
    });
};

exports.queryComponentsByType = function(req, res) {
    var where = {};
    var search = req.query['comType'];
    if (req.query['comType']) {
        where = {
            comType: search
        };
    }
    var query = ComponentModel.find(where).populate('pictures').sort({
        '_id': -1
    });
    query.exec(function(error, results) {
        if (error) {
            helper.wrapQuery(error);
        } else {
            var resultSet = {
                objectList: results,
                success: true
            };
            return res.json(resultSet);
        }
    });
};

exports.queryComponent = function(req, res) {
    var id = req.query['comId'];
    var condition = {
        _id: id
    };
    ComponentModel.find(condition).populate('pictures').exec(function(err, component) {
        if (err) {
            res.json(helper.wrapQuery(err));
        } else {
            if (component.length != 1) {
                res.json(helper.wrapQuery('没有相关数据！'));
            } else {
                res.json(component[0]);
            }
        }
    });
};

exports.updateComponent = function(req, res) {
    var v = req.body;
    var component = new ComponentModel(v);
    ComponentModel.findById(req.body._id).populate('picture').exec(function(err, component) {
        if (err) return res.json(helper.wrapUpdate(err));
        component.comName = v.comName;
        component.comDescription = v.comDescription;
        component.comType = v.comType;
        component.price = v.price;

        component.save(function(err, component) {
            if (err) {
                res.json(helper.wrapUpdate(err));
            } else {
                res.json(helper.wrapUpdate());
            }
        });
    });
};

exports.addComponent = function(req, res) {
    var file = req.files.file;
    var target_path = './public/images/component/' + req.files.file.name;
    var component = new ComponentModel();
    component.comName = req.body.comName;
    component.comDescription = req.body.comDescription;
    component.comType = req.body.comType;
    component.price = req.body.price;
    component.path = target_path;
    component.pictures = [];
    var pic = new PictureModel({
        path: target_path,
        name: file.name,
        size: file.size,
        type: file.type
    });

    pic.save(function(err, picture) {
        component.pictures.push(picture);
        component.save(function(err, component) {
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
                    // delete tmp folder
                    fs.unlink(tmp_path, function() {
                        if (err) res.json(helper.wrapUpdate(err));
                        res.send('File uploaded to: ' + target_path + ' - ' + component.size + ' bytes');
                    });
                });
            }
        });
    })
};

exports.createComponent = function(req, res) {
    var component = new ComponentModel();
    component.comName = req.body.comName;
    component.comDescription = req.body.comDescription;
    component.comType = req.body.comType;
    component.price = req.body.price;
    component.save(function(err, component) {
        if (err) {
            res.json(helper.wrapAdd(err));
        } else {
            res.json(helper.wrapAdd());
        }
    });
};

exports.addPicture = function(req, res) {
    ComponentModel.findById(req.body.comId, function(err, component) {
        if (err) return res.json(helper.wrapUpdate(err));
        var pic = new PictureModel({
            path: './public/images/component/' + req.files.file.name,
            name: req.files.file.name,
            size: req.files.file.size,
            type: req.files.file.type
        });

        pic.save(function(err, picture) {
            component.pictures.push(picture);
            component.save(function(err, component) {
                if (err) {
                    res.json(helper.wrapUpdate(err));
                } else {
                    res.json(helper.wrapUpdate());
                }

                if (req.files) {
                    var file = req.files.file;
                    var target_path = './public/images/component/' + req.files.file.name;
                    var tmp_path = req.files.file.path;
                    fs.rename(tmp_path, target_path, function(err) {
                        if (err) {
                            return res.json({
                                err: err
                            });
                        }
                        // delete tmp folder
                        fs.unlink(tmp_path, function() {
                            if (err) res.json(helper.wrapUpdate(err));
                            res.send('File uploaded to: ' + target_path + ' - ' + component.size + ' bytes');
                        });
                    });
                }
            });

        });
    });
};

exports.deletePicture = function(req, res) {
    var id = req.query['comId'];
	var pictureId = req.query['pictureId'];
    ComponentModel.findById(id).populate('pictures').exec( function(err, component) {
        if (err) return res.json(helper.wrapUpdate(err));

		var pics = component.pictures;
		for(var i =0; i< pics.length; i++) {
			if(pics[i]._id == pictureId) {
				pics.splice(i,1);
			}
		}

        component.save(function(err, component) {
            if (err) {
                res.json(helper.wrapUpdate(err));
            } else {
                res.json(helper.wrapUpdate());
            }
        });
    });
};
