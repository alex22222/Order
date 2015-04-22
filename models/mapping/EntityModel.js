var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var child = new Schema({
    title: String,
    path: String,
    size: Number,
    uploaddate: String,
    description: String
});
var vehicle1 = new Schema({
    title: String,
    path: String,
    size: Number,
    uploaddate: String,
    description: String,
    nodes: [child]
});
var vehicle2 = new Schema({
    title: String,
    path: String,
    size: Number,
    uploaddate: String,
    description: String,
    nodes: [vehicle1]
});
var vehicle3 = new Schema({
    title: String,
    path: String,
    size: Number,
    uploaddate: String,
    description: String,
    nodes: [vehicle2]
});
var vehicleSchema = new Schema({
    title: String,
    path: String,
    size: Number,
    uploaddate: String,
    description: String,
    nodes: [vehicle3]
});

var componentSchema = new Schema({
    name: String,
    path: String,
    size: Number,
    uploaddate: String,
    author: String,
    type: String,
    description: String,
    extension: String,
    comName: String,
    comDescription: String,
    vehicles: [{
        type: Schema.Types.ObjectId,
        ref: 'VehicleEntity'
    }]
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
    }]
});

mongoose.model('Component', componentSchema);
mongoose.model('Vehicle', vehicleSchema);
mongoose.model('VehicleEntity', vehicleSchema);