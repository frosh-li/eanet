var md5 = require('md5').digest_s;
var path = require('path');
var fs = require('fs');
module.exports = {
    router: "/swiper/",
    post: function( req, res, next ) {
        console.log('session');
        console.log(req.session);
        var orderid = req.body.orderid;
        var data = _.pick(req.body, 'type')
            , uploadPath = path.normalize('./uploads')
            , file = req.files.file;

        console.log(file.name); //original name (ie: sunset.png)
        console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
        console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
        req.session.uploadFile = file.path;
        // fs.unlink(file.path);
        // connection.release();
        pool.getConnection(function(err, conn) {
            var sql = 'update swiper set src="'+file.path+'" where id='+req.body.id;
            if(req.body.type == 1){
                sql = 'update ad set src="'+file.path+'" where id='+req.body.id;
            }
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({
                    status: 200,
                    path: file.path
                });
            });
            conn.release();
        });

    },
    get: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            var sql = 'select * from swiper order by id asc';
            if(req.query.type == 1){
                sql = 'select * from ad order by id asc';
            }
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json(datas);
            });
            conn.release();
        });
    },
    put: function( req, res, next ) {
        next();
    },
    delete: function( req, res, next ) {
        next();
    },
    all: function( req, res, next ) {
        next();
    }
};
