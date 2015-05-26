var index = require('./index');
var user = require('./user');
var component = require('./component');
var vehicle = require('./vehicle');
var vehicleEntity = require('./vehicleEntity');
var helper = require('./helper');

function requiredAuthentication(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        var err = {};
        res.json(helper.wrapAuth('没有权限访问！请以管理员身份登入！'));
    }
}

function requiredLogon(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        var err = {};
        res.json(helper.wrapAuth('访问过期，请再次登入！'));
    }
}

module.exports = function(app) {
    app.get('/', index.index);

    
    app.post('/user/signup', user.create);
    app.post('/user/login', user.login);
    app.get('/user/logout', user.logout);
    app.get('/user/edit', user.queryUser);
	app.get('/user/suspend', user.suspendUser);
	app.post('/user/update', user.updateUser);
	app.post('/user/resetPass', user.resetPass);
//
//    app.post('/admin/vehicle/update', vehicle.updateVehicle);
//    app.get('/admin/vehicle/structure', vehicle.queryVehicle);

	app.get('/admin/user/list', requiredAuthentication, user.list);
	app.get('/admin/user/delete', requiredAuthentication, user.deleteUser);
	app.post('/admin/user/update', requiredAuthentication, user.updateUser);
	
    app.get('/admin/vehicleEntity/list', requiredAuthentication, vehicleEntity.listVehicle);
    app.post('/admin/vehicleEntity/add', requiredAuthentication, vehicleEntity.addVehicle);
    app.post('/admin/vehicleEntity/create', requiredAuthentication, vehicleEntity.createVehicle);
    app.post('/admin/vehicleEntity/update', requiredAuthentication, vehicleEntity.updateVehicle);
    app.get('/admin/vehicleEntity/edit', requiredAuthentication, vehicleEntity.queryVehicle);
    app.get('/admin/vehicleEntity/delete', requiredAuthentication, vehicleEntity.deleteVehicle);
	app.post('/admin/vehicleEntity/addPicture', requiredAuthentication, vehicleEntity.addPicture);
    app.get('/admin/vehicleEntity/deletePicture', requiredAuthentication, vehicleEntity.deletePicture);

    app.post('/admin/component/add', requiredAuthentication, component.addComponent);
    app.post('/admin/component/create', requiredAuthentication, component.createComponent);
    app.get('/admin/component/list', requiredAuthentication, component.listComponent);
    app.get('/admin/component/delete', requiredAuthentication, component.deleteComponent);
    app.get('/admin/component/edit', requiredAuthentication, component.queryComponent);
    app.post('/admin/component/update', requiredAuthentication, component.updateComponent);
    app.post('/admin/component/addPicture', requiredAuthentication, component.addPicture);
    app.get('/admin/component/deletePicture', requiredAuthentication, component.deletePicture);
	app.get('/admin/component/queryByType', requiredAuthentication, component.queryComponentsByType);
};
