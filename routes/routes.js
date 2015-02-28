var index = require('./index');
var user = require('./user');
var admin = require('./admin');
module.exports = function (app) {
    app.get('/', index.index);
    app.get('/user/list', user.list);
    app.post('/user/registry', user.create);
    app.post('/user/login', user.login);
    app.post('/admin/upload', admin.upload);
    app.post('/admin/vehicle/update', admin.updateVehicle);
    app.get('/admin/vehicle/list', admin.queryVehicle);
    app.get('/admin/pic/list', admin.list);
    app.get('/admin/pic/delete', admin.deletePic);
    app.get('/admin/pic/edit', admin.queryPic);
    app.post('/admin/pic/update', admin.updatePic);
};