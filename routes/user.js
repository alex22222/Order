/*
 * GET users listing.
 */

var UsersModel = require("./../models").Users;
var AddressModel = require("./../models").Address;
var path = require('path');
var helper = require('./helper');

exports.list = function(req, res) {

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
    var query = UsersModel.find(where).skip(skipFrom).sort({
        '_id': -1
    }).limit(itemsPerPage);

    query.exec(function(error, results) {
        if (error) {
            helper.wrapQuery(error);
        } else {
            UsersModel.count(where, function(error, count) {
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
    req.body.suspend = false;
    if (req.body.username == "Admin") {
        req.body.isAdmin = true;
    } else {
        req.body.isAdmin = false;
    }
    var createUser = new UsersModel(req.body);
    UsersModel.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err)
            return res.json({
                err: err
            });
        if (user) {
            return res.json({
                err: "用户名已经存在"
            });
        }
        createUser.save(function(err, user) {
            if (err) {
                return res.json({
                    err: err
                });
            }
            req.session["user"] = user;
            res.json(user);
        });
    });
};

exports.login = function(req, res) {
    UsersModel.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err)
            return res.json({
                err: err
            });
        if (!user) {
            return res.json({
                err: '用户名不存在'
            });
        }
        if (user.suspend) {
            return res.json({
                err: '该用户已被暂停，请联系管理员！'
            });
        }
        if (!user.authenticate(req.body.password))
            return res.json({
                err: '密码错误'
            });
        req.session["user"] = user;
        res.json(user);
    });
};

exports.logout = function(req, res) {
    req.session["user"] = null;
    req.user = null;
    req.session.regenerate(function() {
        res.json('注销成功');
    });
};

exports.queryUser = function(req, res) {
    var id = req.query['userId'];
    var condition = {
        _id: id
    };
    UsersModel.findById(id).populate('addresses').exec(function(err, user) {
        if (err) {
            res.json(helper.wrapQuery(err));
        } else {
            if (user) {
                var u = user;
                u.success = true;
                res.json(u);
            } else {
                res.json(helper.wrapQuery('没有相关数据！'));
            }
        }
    });
};

exports.suspendUser = function(req, res) {
    var v = req.body;
    var user = new UsersModel(v);
    UsersModel.findById(req.query['userId']).exec(function(err, user) {
        if (err) {
            res.json(helper.wrapQuery(err));
        }

        user.suspend = !user.suspend;
        user.save(function(err, user) {
            if (err) {
                res.json(helper.wrapUpdate(err));
            } else {
                res.json(helper.wrapUpdate());
            }
        });


    });
};

exports.updateUser = function(req, res) {
    var v = req.body;

    UsersModel.findById(v._id).exec(function(err, user) {
        if (err) {
            res.json(helper.wrapQuery(err));
        }
        user.username = v.username;
        user.email = v.email;
        user.phone = v.phone;
        user.addresses = [];
        for (var i = 0; i < v.addresses.length; i++) {
            var active = false;
            if (v.addresses[i].active) {
                active = true;
            }
            var add = new AddressModel({
                country: v.addresses[i].country,
                city: v.addresses[i].city,
                district: v.addresses[i].district,
                line1: v.addresses[i].line1,
                postal: v.addresses[i].postal,
                active: active,
                contact: v.addresses[i].contact,
                contactPhone: v.addresses[i].contactPhone
            });
            user.addresses.push(add);
        }
        user.save(function(err, user) {
            if (err) {
                res.json(helper.wrapUpdate(err));
            } else {
                res.json(helper.wrapUpdate());
            }
        });


    });
};

exports.deleteUser = function(req, res) {
    var id = req.query['userId'];
    var condition = {
        _id: id
    };
    UsersModel.remove(condition, function(err) {
        if (err) {
            res.json(helper.wrapDelete(err));
        } else {
            res.json(helper.wrapDelete());
        }
    });
};

exports.resetPass = function(req, res) {
    var v = req.body;
    UsersModel.findById(v._id).exec(function(err, user) {
        if (err) {
            res.json(helper.wrapQuery(err));
        }
        if (!user.authenticate(req.body.password_old)) {
            res.json(helper.wrapQuery('原密码错误！'));
        } else {
            user.password = v.password_new;
            user.save(function(err, user) {
                if (err) {
                    res.json(helper.wrapUpdate(err));
                } else {
                    res.json(helper.wrapUpdate());
                }
            });
        }
    });
};
