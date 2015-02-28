var PictureModel = require("./../models").Pictures;
var VehiclesModel = require("./../models").Vehicles;
var fs = require('fs');

exports.deletePic = function (req, res) {
    var id = req.query['comId'];
    var condition = {_id: id};
    PictureModel.remove(condition,function(err){
        if(err) {
            res.json("删除失败");
        } else {
            res.json("删除成功");
        }
    });
};

exports.list = function (req, res) {

    var where = {};
    var search = req.query['search'];
    if(req.query['search']){
        where = {comName: search};
    }
   
    var pageNumber=req.query['pageNumber'];
    var itemsPerPage=req.query['itemsPerPage'];

    var skipFrom = (pageNumber * itemsPerPage) - itemsPerPage;
    var query = PictureModel.find(where).skip(skipFrom).limit(itemsPerPage);

    query.exec(function(error, results) {
        if (error) {
          // callback(error, null, null);
        } else {
            PictureModel.count(where, function(error, count) {
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
                            pictureList:results,
                            page:page
                    };
                    return res.json(resultSet);
                }
          });
        }
    });
};

exports.queryPic = function (req, res) {
    var id = req.query['comId'];
    var condition = {_id: id};
    PictureModel.find(condition,function(err, picture){
        if(err) {
            res.json("查询失败");
        } else {
            if(picture.length != 1) {
                res.json("查询失败");
            } else {
                res.json(picture[0]);
            }
        }
    });
};

exports.updatePic = function (req, res) {
    
    var v = req.body;
    var pic = new PictureModel(v);
    PictureModel.findById(req.body._id, function (err, pic) {
      if (err) return res.json("更新失败");
      pic.comName = v.comName;
      pic.comDescription = v.comDescription;
      pic.vehicles = [];
      for(var i =0; i < v.vehicles.length; i++) {
        var ve = new VehiclesModel({
            _id: v.vehicles[i]._id,
            title:v.vehicles[i].title
        });
        pic.vehicles.push(ve);
      }    

      // pic.vehicles.push(ve);
      if(req.files) {
          pic.path = './public/images/' + req.files.file.name;
          pic.name= req.files.file.name;
      }
      pic.save(function(err, pic) {
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
                    res.send('File uploaded to: ' + target_path + ' - ' + pic.size + ' bytes');
                });
            });
        }
      });
    });
};

exports.upload = function (req, res) {
	var file = req.files.file;
    var target_path = './public/images/' + req.files.file.name;
    var pic = new PictureModel();
    pic.comName = req.body.comName;
    pic.comDescription = req.body.comDescription;
    pic.name = file.name;
    pic.size = file.size;
    pic.type = file.type;
    pic.path = target_path;
    pic.save(function(err, pic) {
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
                    res.send('File uploaded to: ' + target_path + ' - ' + pic.size + ' bytes');
                });
            });
        }
    });
};

exports.updateVehicle = function (req, res) {
    var v = req.body;
    VehiclesModel.remove().exec();
    for(var i=0, l = req.body.length; i<l ;i++) {
        var vehicle = new VehiclesModel(req.body[i]);
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
    VehiclesModel.find(function(err,vehicles){
        res.json(vehicles);
    });
};