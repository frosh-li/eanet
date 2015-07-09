var express = require( 'express' );
var path = require( 'path' );
var favicon = require( 'serve-favicon' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );
var session = require( 'express-session' );
var MongoStore = require( 'connect-mongo' )( session );
var request = require( 'request' ); //.defaults({'http_proxy': 'http://proxy1.wanda.cn:8080'});
var mysql = require('mysql');
var _ = require('underscore');
var parseXlsx = require('excel');
var SessionStore = require('express-mysql-session');


global.pool  = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'med',
  multipleStatements: true
});
var sessionStore = new SessionStore({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'med'
});

pool.getConnection(function(err, connection) {
    console.log('mysql 连接成功');
    // global.sessionStore = new SessionStore({}/* session store options */, connection);
    connection.release();
});
var fs = require( 'fs' );

var EventEmitter = require( 'events' ).EventEmitter;

global.mongoEmitter = new EventEmitter();

var log4js = require( 'log4js' );
log4js.configure( {
    appenders: [
        { type: 'console' }
    ],
    replaceConsole: true
} );
global.log = log4js.getLogger( 'Main' );

global.models = {};

//global.db = require( './libs/db/db.js' );

global.uuid = require( 'uuid' );
global.async = require( 'async' );


var controllers = require( './controllers' );
var auth = require( './auth' );
//var passport = require('passport');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser( "node" ) );
app.use( session( {
    secret: 'keyboard cat',
    key: 'sid',
    store: sessionStore,
    //store: new MongoStore( { url: 'mongodb://' + mongoConfig.host + ':' + mongoConfig.port + '/node-session' } ),
    cookie: { secure: false },
    resave: false,
    saveUninitialized: true
} ) );

var multipart = require('connect-multiparty');
app.use(multipart({
    uploadDir: './uploads/'
}));

app.use('/api/upload/', function(req, res, next){
    var data = _.pick(req.body, 'type')
    , uploadPath = path.normalize('./uploads')
    , file = req.files.file;

    console.log(file.name); //original name (ie: sunset.png)
    console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
    console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
    parseXlsx(file.path, function(err, data) {
        if(err) {
            res.json({
                status: 500,
                msg: err.message
            });
            return;
        };

        var inserts = [];

        var sql = "insert into comp_info(name, type, shortname,pingying, address, city,contact, email, fax, telephone, mobile, website, zipcode,password,create_date, status) values";

        data.forEach(function(item){
            if(item && (item[1] == 1 || item[1] == 2)){
                item.forEach(function(ii, index){
                    if(index == 1 || index == item.length-1){
                        return;
                    }
                    item[index] = "'"+ii+"'";
                });
                item[1] = parseInt(item[1]);
                item[item.length - 1] = parseInt(item[item.length - 1]);

                inserts.push('('+item.join(',')+')');
            }
        });

        sql += inserts.join(',');
        if(inserts.length <= 0){
            return res.json({
                status: 500,
                msg: '无法解析数据'
            });
        }
        console.log(sql);

        pool.getConnection(function(err, connection) {
            if(err){
                return res.json({
                    status: 500,
                    msg: err.message
                });
            }
            connection.query(sql, function(err, data){
                if(err){
                    return res.json({
                        status: 500,
                        msg: err.message
                    });
                }
                res.json({
                    status: 200,
                    length: inserts.length
                })
            });
            connection.release();
        });
        fs.unlink(file.path);
    });

});
/**
 * 加入通用的跨域支持
 * 到时候需要把Origin设置为合适的值
 */
app.all( '*', function( req, res, next ) {
    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With, X-TOKEN, X-UID" );
    res.header( "Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS" );
    res.header( "X-Powered-By", 'wanda.cn' );
    next();
} );
app.use( function( req, res, next ) {
    console.log(req.session);
    next();
} );

/**
 * 如果有pull更新
 * 自动拉去代码
 */

app.use( '/autopull', function( req, res, next ) {
    var exec = require( 'child_process' ).exec,
        child;
    console.log( 'start auto pull' );
    child = exec( 'git pull',
        { cwd: '/home/sre/work/node-B-platform' },
        function( error, stdout, stderr ) {
            console.log( 'stdout: ' + stdout );
            console.log( 'stderr: ' + stderr );
            if ( error !== null ) {
                console.log( 'exec error: ' + error );
            }
        } );
} );

/**
 * 想读权限
 * 如果是ucenter下面的action
 * 所有人都有权限
 * 例如登录操作
 */

// app.use( auth );

/**
 * 如果有本地的路由可以进行响应的
 * 不会去请求业态的RPC服务器
 */

// app.use('/', controllers);

controllers.setup( app );


function setUrl( url, params ) {
    var doHasParams = false;
    for ( var key in params ) {
        var reg = new RegExp( ':' + key, 'g' );
        url = url.replace( reg, params[ key ] );
        doHasParams = true;
    }
    if ( doHasParams ) {
        log.info( 'replaced request', url );
    }
    return url;

}
module.exports = app;

/**
 * 注意
 * 这里关闭了express默认的404和500
 * 可能到导致如果是404或者500的请求响应速度比较慢
 * 这一块需要再研究
 */
