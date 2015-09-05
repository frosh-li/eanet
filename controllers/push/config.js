var JPush = require('jpush-sdk');
var client = JPush.buildClient('1b7ee4b42a31e5897dd7ab42','384264e442cec348ebdac2a5');
module.exports = {
    router: "/config/",
    post: function( req, res, next ) {

        var key = req.body.upkey;
        var val = req.body.upval;
        console.log(key, val);

        if(!key || !val){
            return res.json({status: 500, msg:'参数错误', key:key, val:val})
        }
        var obj = 'value='+parseInt(val);
        var sql = 'update config set '+obj+' where `key`="'+key+'"';

        console.log(sql);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, scores){
                if(err){
                    return res.json({status: 500, err: err.message});
                };
                return res.json({
                    status: 200
                });

            })
            conn.release();
        });
    },
    get: function( req, res, next ) {
        var code = req.params.id;
        var keys = ['daily','month','freecount','step_1_score','step_2_score','step_1'];
        var sql = 'select *  from config';
        pool.getConnection(function(err, conn) {
            console.log(sql);
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                var ret = [];
                datas.forEach(function(item){
                    if(keys.indexOf(item.key) > -1){
                        ret.push(item);
                    }
                })
                res.json(ret);
            });
            conn.release();
        });
    },
    put: function( req, res, next ) {
        next();
    },
    delete: function( req, res, next ) {
        var code = req.params.id;
        if ( !code ) {
            res.json( {
                status: 500,
                msg: "参数缺失:code"
            } );
            return;
        }
        var sql = 'delete from push where id='+code;
        console.log(sql);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
    },
    all: function( req, res, next ) {
        next();
    }
};
