var mongoose = require('mongoose');
var Promise = require('promise');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var OId = mongoose.Schema.ObjectId.fromString;
var md5 = require('md5').digest_s;

var apilistItem = new Schema({
    url : {
        type: String
    },
    method: {
        type: String
    }
})
var UserGroup = new Schema({
	name : {
		type:String,
        index:true,
        unique:true
	},
    apilist: [apilistItem]
}, {_id: true});

var GroupModel = mongoose.model('group', UserGroup);

// 初始化超级管理员组
GroupModel.findOne({name: '超级管理员'}, function(err, group){
	if(err){
		debug.error(err);
		return;
	}
	if(!group){
		var group = new GroupModel({
            "name": "超级管理员",
			"apilist" : [  {
				url:"/",
				method: "*"
			} ]
		});
		group.save(function(err, admin){
			if(err){
				log.debug(err);
				return;
			}
			log.info('创建默认管理员账户成功', admin);
		});
	}
});
module.exports = GroupModel;