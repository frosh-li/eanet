var mongoose = require('mongoose');
var Promise = require('promise');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var OId = mongoose.Schema.ObjectId.fromString;
var md5 = require('md5').digest_s;

var innerApi = new Schema({
    name: {
		type:String,
		default: "",
        unique:true
	},
	url: {
		type: String,
		default: "",
        index:true,
	},
	method: {
		type:String
	},
	isMenu: {
		type:String
	}
}, {_id: false});

var Api = new Schema({
	code : {
		type:String,
        index:true,
        unique:true
	},
    model: {
        type:String,
        unique:true
    },
    uri: {
    	type:String
    },
    innerApi: [innerApi]
}, {_id: false});

var ApiModel = mongoose.model('Api', Api);
module.exports = ApiModel;