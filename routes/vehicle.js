var VehicleModel = require("./../models").Vehicle;
var helper = require('./helper');

exports.updateVehicle = function (req, res) {
    var v = req.body;
    VehicleModel.remove().exec();
    for(var i=0, l = req.body.length; i<l ;i++) {
        var vehicle = new VehicleModel(req.body[i]);
        vehicle.save(function (err, vehicles) {
            if (err) {
                return res.json({err:err});
            }
            var result =  helper.wrapUpdate();
            var r = [
                  result
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


exports.listVehicle = function (req, res) {
    var where = {};
    var search = req.query['search'];
    if(req.query['search']){
        where = {title: search};
    }
   
    var pageNumber=req.query['pageNumber'];
    var itemsPerPage=req.query['itemsPerPage'];

    var skipFrom = (pageNumber * itemsPerPage) - itemsPerPage;
    var query = VehicleModel.find(where).skip(skipFrom).sort({'_id':-1}).limit(itemsPerPage);

    query.exec(function(error, results) {
        if (error) {
          // callback(error, null, null);
        } else {
            VehicleModel.count(where, function(error, count) {
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
                            vehicleList:results,
                            page:page
                    };
                    return res.json(resultSet);
                }
          });
        }
    });
};