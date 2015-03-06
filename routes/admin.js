var ComponentModel = require("./../models").Component;
var VehicleModel = require("./../models").Vehicle;
var fs = require('fs');

exports.deleteComponent = function (req, res) {
    var id = req.query['comId'];
    var condition = {_id: id};
    ComponentModel.remove(condition,function(err){
        if(err) {
            res.json("删除失败");
        } else {
            res.json("删除成功");
        }
    });
};

exports.listComponent = function (req, res) {

    var where = {};
    var search = req.query['search'];
    if(req.query['search']){
        where = {comName: search};
    }
   
    var pageNumber=req.query['pageNumber'];
    var itemsPerPage=req.query['itemsPerPage'];

    var skipFrom = (pageNumber * itemsPerPage) - itemsPerPage;
    var query = ComponentModel.find(where).skip(skipFrom).limit(itemsPerPage);

    query.exec(function(error, results) {
        if (error) {
          // callback(error, null, null);
        } else {
            ComponentModel.count(where, function(error, count) {
                if (error) {
                  // callback(error, null, null);
                } else {
                    var page={limit:5,num:1};
                    var pageCount = Math.ceil(count / itemsPerPage);
                    page['pageCount']=pageCount;
                    page['currentPage']=pageNumber;
                    page['size']=count;
                    page['itemsPerPage']=itemsPerPage;
                    var resultSet = {
                            componentList:results,
                            page:page
                    };
                    return res.json(resultSet);
                }
          });
        }
    });
};

exports.queryComponent = function (req, res) {
    var id = req.query['comId'];
    var condition = {_id: id};
    ComponentModel.find(condition,function(err, component){
        if(err) {
            res.json("查询失败");
        } else {
            if(component.length != 1) {
                res.json("查询失败");
            } else {
                res.json(component[0]);
            }
        }
    });
};

exports.updateComponent = function (req, res) {
    
    var v = req.body;
    var component = new ComponentModel(v);
    ComponentModel.findById(req.body._id, function (err, component) {
      if (err) return res.json("更新失败");
      component.comName = v.comName;
      component.comDescription = v.comDescription;
      component.vehicles = [];
      for(var i =0; i < v.vehicles.length; i++) {
        var ve = new VehicleModel({
            _id: v.vehicles[i]._id,
            title:v.vehicles[i].title
        });
        component.vehicles.push(ve);
      }    

      // component.vehicles.push(ve);
      if(req.files) {
          component.path = './public/images/' + req.files.file.name;
          component.name= req.files.file.name;
      }
      component.save(function(err, component) {
        if(err) {
            res.json("更新失败");
        } else {
            res.json("更新成功");
        }

        if(req.files) {
            var file = req.files.file;
            var target_path = './public/images/' + req.files.file.name;
            var tmp_path = req.files.file.path;
            fs.rename(tmp_path, target_path, function(err) {
                if (err) {
                    return res.json({err:err});
                }
                // delete tmp folder
                fs.unlink(tmp_path, function() {
                    if (err) res.json("更新失败");
                    res.send('File uploaded to: ' + target_path + ' - ' + component.size + ' bytes');
                });
            });
        }
      });
    });
};

exports.addComponent = function (req, res) {
	var file = req.files.file;
    var target_path = './public/images/' + req.files.file.name;
    var component = new ComponentModel();
    component.comName = req.body.comName;
    component.comDescription = req.body.comDescription;
    component.name = file.name;
    component.size = file.size;
    component.type = file.type;
    component.path = target_path;
    component.save(function(err, component) {
        if(err) {
            res.json("更新失败");
        } else {
            res.json("更新成功");
        }
        if(file) {
            var tmp_path = req.files.file.path;
            fs.rename(tmp_path, target_path, function(err) {
                if (err) {
                    return res.json({err:err});
                }
                // delete tmp folder
                fs.unlink(tmp_path, function() {
                    if (err) res.json("更新失败");
                    res.send('File uploaded to: ' + target_path + ' - ' + component.size + ' bytes');
                });
            });
        }
    });
};

exports.createComponent = function (req, res) {
    var component = new ComponentModel();
    component.comName = req.body.comName;
    component.comDescription = req.body.comDescription;
    component.vehicles = [];
    for(var i =0; i < req.body.vehicles.length; i++) {
        var ve = new VehicleModel({
            _id: req.body.vehicles[i]._id,
            title:req.body.vehicles[i].title
        });
        component.vehicles.push(ve);
    }    
    component.save(function(err, component) {
        if(err) {
            res.json("更新失败");
        } else {
            res.json("更新成功");
        }
    });
};

exports.updateVehicle = function (req, res) {
    var v = req.body;
    VehicleModel.remove().exec();
    for(var i=0, l = req.body.length; i<l ;i++) {
        var vehicle = new VehicleModel(req.body[i]);
        vehicle.save(function (err, vehicles) {
            if (err) {
                return res.json({err:err});
            }
            var r = [
                  {
                    "result": "success"
                  }
                ];
            return res.json(r);
        });
    }
    
};

exports.queryVehicle = function (req, res) {
    VehicleModel.find(function(err,vehicles){
        res.json(vehicles);
    });
};