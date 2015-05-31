var UsersModel = require("./../models").Users;
var AddressModel = require("./../models").Address;
var OrderModel = require("./../models").Order;
var helper = require('./helper');

exports.list = function(req, res) {

    var where = {};
    //    var user = req.query['code'];
    //    if (req.query['code']) {
    //        where = {
    //            code: code
    //        };
    //    }

    var pageNumber = req.query['pageNumber'];
    var itemsPerPage = req.query['itemsPerPage'];

    var skipFrom = (pageNumber * itemsPerPage) - itemsPerPage;
    var query = OrderModel.find(where).skip(skipFrom).sort({
        '_id': -1
    }).limit(itemsPerPage);

    query.exec(function(error, results) {
        if (error) {
            helper.wrapQuery(error);
        } else {
            OrderModel.count(where, function(error, count) {
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

exports.queryByUser = function(req, res) {

    var where = {};
    var user = req.query['user'];
    if (req.query['user']) {
        where = {
            user: user
        };
    }

    var pageNumber = req.query['pageNumber'];
    var itemsPerPage = req.query['itemsPerPage'];

    var skipFrom = (pageNumber * itemsPerPage) - itemsPerPage;
    var query = OrderModel.find(where).skip(skipFrom).sort({
        '_id': -1
    }).limit(itemsPerPage);

    query.exec(function(error, results) {
        if (error) {
            helper.wrapQuery(error);
        } else {
            OrderModel.count(where, function(error, count) {
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

exports.create = function(req, res) {
    req.body.status = '待审核';
    var date = new Date();
    req.body.code = date.getTime();
    req.body.totalPrice = req.body.totalPrice.toFixed(2);
    var order = new OrderModel(req.body);
    order.save(function(err, order) {
        if (err) {
            return res.json({
                err: err
            });
        }
        var result = {
            code: order.code
        };
        res.json(result);
    });
};

exports.updateStatus = function(req, res) {
    var status = req.query['status'];
    OrderModel.findById(req.query['orderId']).exec(function(err, order) {
        if (err) {
            res.json(helper.wrapQuery(err));
        }

        order.status = status;
        order.save(function(err, order) {
            if (err) {
                res.json(helper.wrapUpdate(err));
            } else {
                res.json(helper.wrapUpdate());
            }
        });
    });
};

exports.delete = function(req, res) {
    var id = req.query['orderId'];
    var condition = {
        _id: id
    };
    OrderModel.remove(condition, function(err) {
        if (err) {
            res.json(helper.wrapDelete(err));
        } else {
            res.json(helper.wrapDelete());
        }
    });
};
