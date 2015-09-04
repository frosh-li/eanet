var path = require('path');
var fs = require('fs');
module.exports = {
    router: "/zizhi/",
    post: function( req, res, next ) {
        var key = req.body.key;
        var comp_id = req.session.comp_id;
        if(!comp_id || ['img_01', 'img_02', 'img_03', 'img_04', 'img_05', 'img_06'].indexOf(key) < 0){
            return res.json({
                status:500,
                msg: '参数错误',
                comp_id: comp_id,
                key: key
            })
        }
        var data = _.pick(req.body, 'type')
            , uploadPath = path.normalize('./uploads')
            , file = req.files.file;

        console.log(file.name); //original name (ie: sunset.png)
        console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
        console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
        // fs.unlink(file.path);
        // connection.release();
        pool.getConnection(function(err, conn) {
            var sql = 'update comp_info set '+key+'="'+file.path+'" where id='+comp_id;

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
        var comp_id = req.params.id;
        if(!comp_id){
            return res.json({
                status: 500,
                err: '无权限操作'
            })
        }
        var sql = "select * from comp_info where id="+comp_id;
        console.log('资质查询', sql);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas[0]});
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
