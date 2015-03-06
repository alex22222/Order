var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var child = new Schema({title: String});
var vehicle1 = new Schema({title: String, nodes: [child]});
var vehicle2 = new Schema({title: String, nodes: [vehicle1]});
var vehicle3 = new Schema({title: String, nodes: [vehicle2]});
var vehicle = new Schema({title: String, nodes: [vehicle3]});

var component = new Schema({
    name:String,
    path:String,
    size:Number,
    uploaddate:String,
    author:String,
    type:String,
    description:String,
    extension:String,
    comName:String,
    comDescription:String,
    vehicles:[vehicle]
});

mongoose.model('Component', component);
mongoose.model('Vehicle', vehicle);

