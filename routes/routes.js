var index = require('./index');
var user = require('./user');
var admin = require('./admin');
module.exports = function (app) {
    app.get('/', index.index);
    app.get('/user/list', user.list);
    app.post('/user/registry', user.create);
    app.post('/user/login', user.login);
    app.post('/admin/vehicle/update', admin.updateVehicle);
    app.get('/admin/vehicle/list', admin.queryVehicle);
    app.post('/admin/component/add', admin.addComponent);
    app.post('/admin/component/create', admin.createComponent);
    app.get('/admin/component/list', admin.listComponent);
    app.get('/admin/component/delete', admin.deleteComponent);
    app.get('/admin/component/edit', admin.queryComponent);
    app.post('/admin/component/update', admin.updateComponent);
};