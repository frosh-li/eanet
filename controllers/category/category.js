var md5 = require('md5').digest_s;
module.exports = {
    router: "/category/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            // req.body.comp_id = req.session.comp_id;

            conn.query('insert into good_cat set ?',req.body, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
    },
    get: function( req, res, next ) {
        var sql = 'select * from good_cat';
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                var ret_group = [];
                ret.forEach(function(item){
                    if(item.parent_id == 0){
                        var level_1 = {id:item.id, name:item.cat_name, children: []};
                        // ret_group.push([item.id, item.cat_name]);
                        ret.forEach(function(_item){
                            if(_item.parent_id === item.id){
                                var level_2 = {id:_item.id, name:_item.cat_name, children:[]};
                                ret.forEach(function(__item){
                                    if(__item.parent_id === _item.id){
                                        level_2.children.push({id:__item.id, name:__item.cat_name});
                                    }
                                });
                                level_1.children.push(level_2);
                            }
                        });
                        ret_group.push(level_1);
                    }
                });

                res.json({
                    status: 200,
                    data: ret_group
                });

            });
            conn.release();
        });
    },
    put: function( req, res, next ) {
        next();
    },
    delete: function( req, res, next ) {
        log.info( 'api delete' );
        var code = req.params.id;
        if ( !code ) {
            res.json( {
                status: 500,
                msg: "参数缺失:code"
            } );
            return;
        }
        var sql = 'delete from good_cat where id='+code + ' and where parent_id='+code;
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
