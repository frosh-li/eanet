module.exports = {
    router: "/relate/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            console.log(req.body);
            if(req.body.remove == 1){
                // delete req.body.remove;
                var sql = 'delete from comp_map where comp_id_1='+parseInt(req.body.comp_id_1)+' and comp_id_2='+parseInt(req.body.comp_id_2);
                console.log(sql);
                conn.query(sql, function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    res.json({status: 200, data: datas});
                });
            }else{
                conn.query('insert into comp_map set ?',req.body, function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    res.json({status: 200, data: datas});
                });
            }

            conn.release();
        });
    },
    get: function( req, res, next ) {
        var code = req.params.id;

        if ( code ) {
            console.log(code);
            res.json({status:600});
        } else {
            log.info( 'api list' );
            var limit = parseInt(req.query.count) || 10;
            var page = parseInt(req.query.page) || 1;
            var start = (page-1)*limit;
            var companyid = parseInt(req.query.companyid);
            pool.getConnection(function(err, conn) {
                console.log('mysql 连接成功');
                conn.query('select count(*) as total from comp_map where comp_id_1='+companyid, function(err, ret){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }

                    conn.query('select comp_info.* from comp_info,comp_map where comp_map.comp_id_1='+companyid+' and comp_map.comp_id_2=comp_info.id limit '+start+','+limit, function(err, datas){
                        if(err){
                            return res.json({status: 500, err: err.message});
                        }
                        console.log(ret);
                        res.json({
                            total:ret[0].total || 0,
                            page:page,
                            result:datas
                        });
                    });
                });
                conn.release();
            });
            //res.json({status:500});
        }
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
        var sql = 'delete from comp_info where id='+code;
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
