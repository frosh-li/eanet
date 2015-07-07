var mongoose = require('mongoose');
var fs = require('fs');
options = {
	server: {
		auto_reconnect: true,
		poolSize: 5
	}
};
mongoose.connect('mongodb://'+mongoConfig.host+":"+mongoConfig.port+'/xadmin', options, function(err, res){
	if(err){
		log.error('connect to db node-b-platform error', err);
		return;
	}
	log.info('数据库连接成功');
	initTable();
});

function initTable(){
	fs.readdir(__dirname ,function(err, files){
		if(err){
			log.error(err);
			return;
		}
		files.forEach(function(file){
			if(file == "db.js" || file.substr(-4) == ".swp"){
				return;
			}
			var modelName = file.replace('.js','');
			console.log(__dirname, file);
			global.models[modelName] = require('../../models/'+file);
			module.exports[modelName] = require(__dirname+"/"+file);
			log.debug('init table', file);
		});
		mongoEmitter.emit('db:ready');
	});
}

