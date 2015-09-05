module.exports = {
    router: "/list/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            var user = req.session;
            if(user.role_type != 0){
                return res.json({
                    status: 500,
                    msg:"无权限"
                })
            }
            conn.query('select * from good_info where good_id='+req.body.good_id, function(err,good){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                if(!good || good.length < 1){
                    return res.json({status: 500, err:'查询不到对应药品'});
                }
                conn.query('select * from advise where good_id='+req.body.good_id+' and pos='+req.body.pos, function(err,add){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    if(add && add.length > 0){
                        return res.json({status: 500, err:'请勿重复提交'});
                    }
                    conn.query('insert into advise set ?',req.body, function(err, datas){
                        if(err){
                            return res.json({status: 500, err: err.message});
                        }
                        console.log(datas);
                        console.log('insert order id', datas.insertId);
                        res.json({status: 200, data: datas});
                    });
                });

                conn.release();
            });


        });
    },
    get: function( req, res, next ) {

        var code = req.params.id;
        if ( code ) {
            console.log(code);
            res.json({status:600});
        } else {
            var pos = req.query.pos;
			var limit = parseInt(req.query.count) || 10;
            var page = parseInt(req.query.page) || 1;
            var start = (page-1)*limit;
            var companyid = parseInt(req.query.companyid);
            pool.getConnection(function(err, conn) {
                console.log('mysql 连接成功');
                conn.query('select count(*) as total from advise', function(err, ret){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }

                    conn.query('select comp_info.name,advise.*,good_info.good_name,good_info.good_id from comp_info,advise,good_info where advise.good_id=good_info.good_id and good_info.good_company=comp_info.id and advise.pos='+pos+' limit '+start+','+limit, function(err, datas){
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
        }
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
        var sql = 'delete from advise where id='+code;
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
