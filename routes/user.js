/*
 * GET users listing.
 */

var UsersModel = require("./../models").Users;
var path = require('path');

exports.list = function (req, res) {
    UsersModel.find(function(err,users){


        res.json(users);
    });
};

exports.create = function (req, res) {
    var createUser = new UsersModel(req.body);
    UsersModel.findOne({username:req.body.username}, function (err, user) {
        if (err)
            return res.json({err:err});
        if (user) {
            return res.json({err:"用户名已经存在"});
        }
        createUser.save(function (err, user) {
            if (err) {
                return res.json({err:err});
            }
            req.session["user"] = user;
            res.json();
        });
    });
};

exports.login = function (req, res) {
    UsersModel.findOne({username:req.body.username}, function (err, user) {
        if (err)
            return res.json({err:err});
        if (!user) {
            return res.json({err:'用户名不存在'});
        }
        if (!user.authenticate(req.body.password))
            return res.json({err:'密码错误'});
        if (user.username == 'admin') {
            user.isAdmin = true;
        } else {
            user.isAdmin = false;
        }
        req.session["user"] = user;
        res.json(user);
    });
};

// exports.logout = function (req, res) {
//     req.session["user"] = null;
//     var html = path.normalize(__dirname + '/../views/index.html');
//     res.sendfile(html);
// };
