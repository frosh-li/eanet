var express = require( 'express' );
var router = express.Router();
var fs = require( 'fs' );
var dnode = require( 'dnode' );
var dirs = fs.readdirSync( __dirname + '/' );
var routers = [];

/**
 * ucenter 下面的不需要做什么特殊处理
 * 如果不是ucenter模块
 * 需要配置类似业态的配置
 * 加入数据库，做权限控制
 */


exports.setup = function( app ) {
dirs.forEach( function( dir ) {
    if ( dir === "index.js" ) {
        return;
    }

    var tpath = __dirname + "/" + dir;

    // mac 下有.DS_store文件，不为文件夹，这里把所有的非文件夹剔除
    if ( !fs.statSync( tpath ).isDirectory() ) {
        return;
    }

    var files = fs.readdirSync( __dirname + "/" + dir );

    files.forEach( function( file ) {
        var subRouter = require( __dirname + '/' + dir + '/' + file );
        var routerPath = subRouter.router;
        if ( !routerPath ) {
            return;
        }
        console.log( file, dir );
        var method = [ 'all', 'post', 'get', 'put', 'delete' ];
        app.use( '/api/' + dir + '/', ( function() {
            var router = express.Router();
            method.forEach( function( item ) {
                if ( subRouter[ item ] ) {
                    console.log( subRouter[ item ] );
                    switch ( item ) {
                    case "delete":
                        router.route( routerPath + ":id" )[ item ]( subRouter[ item ] );
                        break;
                    case "put":
                        router.route( routerPath + ":id" )[ item ]( subRouter[ item ] );
                        break;
                    case "get":
                        router.route( routerPath + ":id" )[ item ]( subRouter[ item ] );
                        router.route( routerPath )[ item ]( subRouter[ item ] );
                        break;
                    default:
                        router.route( routerPath )[ item ]( subRouter[ item ] );
                        break;
                    }
                }
            } );
            return router;
        } )() );
    } );
} );
};