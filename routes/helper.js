
exports.wrapAdd = function (err) {
	var res = {};
	if(err) {
		res.message = '新增失败!' + err;
		res.success = false;
	} else {
		res.message = '新增成功!';
		res.success = true;
	}
	return res;
};

exports.wrapDelete = function (err) {
	var res = {};
	if(err) {
		res.message = '删除失败!' + err;
		res.success = false;
	} else {
		res.message = '删除成功!';
		res.success = true;
	}
	return res;
};

exports.wrapUpdate = function (err) {
	var res = {};
	if(err) {
		res.message = '更新失败!' + err;
		res.success = false;
	} else {
		res.message = '更新成功!';
		res.success = true;
	}
	return res;
};

exports.wrapQuery = function (err) {
	var res = {};
	if(err) {
		res.message = '查询失败!' + err;
		res.success = false;
	} else {
		res.message = '查询成功!';
		res.success = true;
	}
	return res;
};