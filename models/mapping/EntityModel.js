var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pictureSchema = new Schema({
	name: String,
    path: String,
    size: Number,
    created: {
        type: Date,
        default: Date.now
    },
    author: String,
    type: String,
    description: String,
    extension: String
});

var componentSchema = new Schema({
    name: String,
    path: String,
    size: Number,
    author: String,
    type: String,
    description: String,
    extension: String,
    comName: String,
    comDescription: String,
    comType: String,
    price: Number,
	pictures: [{
        type: Schema.Types.ObjectId,
        ref: 'Picture'
    }],
    vehicles: [{
        type: Schema.Types.ObjectId,
        ref: 'VehicleEntity'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

var vehicleSchema = new Schema({
    name: String,
    path: String,
    size: Number,
    uploaddate: String,
    author: String,
    type: String,
    description: String,
    extension: String,
    title: String,
    level: String,
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'VehicleEntity'
    }],
    components: [{
        type: Schema.Types.ObjectId,
        ref: 'Component'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

var orderSchema = new Schema({
	code: String,
    status: String,
	totalPrice: Number,
	comments: String,
	deliveryDate: String,
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
	address: [{
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }],
    components: [{
        type: Schema.Types.ObjectId,
        ref: 'Component'
    }],
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
	updatedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }]
});

mongoose.model('Component', componentSchema);
mongoose.model('Picture', pictureSchema);
mongoose.model('VehicleEntity', vehicleSchema);
mongoose.model('Order', orderSchema);
