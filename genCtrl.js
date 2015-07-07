var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' }
    ],
    replaceConsole: true
});
global.log = log4js.getLogger('auto Controller');
var fs = require('fs');
var module = process.argv[2];
var controller = process.argv[3];

if(!module){
	log.error('缺少模块名称参数');
	log.info('使用方式node genCtrl <模块名称> <Controller>');
	process.exit();
}

if(!controller){
	log.error('缺少controller名称参数');
	log.info('使用方式node genCtrl <模块名称> <Controller>');
	process.exit();
}

log.info('正在创建Controller', controller);

var exists = fs.existsSync('./controllers/'+module+'/'+controller+'.js');

if(exists){
	log.error('对应controller已经存在');
	process.exit();
}

var data = fs.readFileSync('./templates/controller.tpl').toString('utf-8');
var reg = new RegExp('{{name}}', "gm");

data = data.replace(reg, controller);

log.info('Controller创建完成，准备写入文件');

exists = fs.existsSync('./controllers/'+module);

if(!exists){
	fs.mkdirSync('./controllers/'+module);
}

fs.writeFileSync('./controllers/'+module+'/'+controller+'.js', data);

log.info('写入完成');
