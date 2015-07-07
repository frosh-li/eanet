var mongoose = require('mongoose');
var Promise = require('promise');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var OId = mongoose.Schema.ObjectId.fromString;
var md5 = require('md5').digest_s;

var User = new Schema({
	username: {
		type:String,
		default: "",
		index: true,
        unique:true
	},
	password: {
		type: String,
		default: ""
	},
	created: {
		type: Date,
		default: Date.now
	},
	platformid: {
		type:String
	},
	platformname: {
		type: String
	},
	auth:{
		type: [String]
	},
	lastlogin:{
		type: Date
	},
	token:{
		type:String
	},
    group:{
        type:String
    },
    merchantID: {
    	type:String,
    	default:'-1'
    }
}, {_id: true});
var UserModel = mongoose.model('User', User);
UserModel.findOne({username: 'admin'}, function(err, user){
	if(err){
		debug.error(err);
		return;
	}
	if(!user){
		var admin = new UserModel({
			"auth" : [  "/" ],
			"created" : new Date(),
			"lastlogin" : new Date(),
			"password" : md5("123456"),
			"platformid" : "1",
			"platformname" : "主平台",
			"token" : "",
			"username" : "admin",
            "group":"超级管理员",
            "merchantID": "-1"
		});
		admin.save(function(err, admin){
			if(err){
				log.debug(err);
				return;
			}
			log.info('创建默认管理员账户成功', admin);
		});
	}
});
module.exports = UserModel;