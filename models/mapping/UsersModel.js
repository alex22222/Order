var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var schema = new Schema({
    username: String,
    hash_password: String,
    sex: Number,
    email: String,
    phone: String,
    addresses: [{
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }],
    isAdmin: Boolean,
    suspend: Boolean
});

var address = new Schema({
    country: String,
    province: String,
    city: String,
	district: String,
    line1: String,
    line2: String,
    postal: String,
	active: Boolean
});

schema.virtual("password").set(function(password) {
    this.hash_password = encryptPassword(password);
});

schema.method("authenticate", function(plainText) {
    return encryptPassword(plainText) === this.hash_password;
});

function encryptPassword(password) {
    return crypto.createHash("md5").update(password).digest("base64");
}

mongoose.model('Users', schema);
mongoose.model('Address', address);