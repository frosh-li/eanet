var md5 = require('md5').digest_s;
module.exports = {
    router: "/map/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            req.body.good_company = req.session.comp_id;
            conn.query('insert into good_info set ?',req.body, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
    },
    get: function( req, res, next ) {
        log.info( 'api list' );
        var code = req.params.id;
        if(code){
            pool.getConnection(function(err, conn) {

                conn.query('select good_info.* from good_info where good_company='+req.session.comp_id+' and good_id='+code, function(err, ret){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    console.log(ret);
                    res.json({
                        status: 200,
                        data: ret[0]
                    });
                });

                conn.release();
            });
        }else{
            var limit = parseInt(req.query.count) || 10;
            var page = parseInt(req.query.page) || 1;
            var start = (page-1)*limit;
		    var good_name = req.query.good_name && decodeURIComponent(req.query.good_name);
		    var good_cp = req.query.good_cp && decodeURIComponent(req.query.good_cp);
		    var filter = [];
		    if(good_name){
				filter.push(" good_name like '%"+good_name+"%' ");
		    }
		    if(good_cp){
				filter.push(" good_cp like '%"+good_cp+"%' ");
		    }
		    var filterquery = filter.join(" and ");
		    if(filterquery){
		        filterquery += " and ";
            }
			console.log(filterquery);
            pool.getConnection(function(err, conn) {
                conn.query('select count(*) as total from good_info where '+filterquery+' good_company='+req.session.comp_id, function(err, ret){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }

                    conn.query('select good_info.* from good_info where '+filterquery+' good_company='+req.session.comp_id+' order by good_id desc limit '+start+','+limit, function(err, datas){
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
        console.log(req.body);
        var id = req.params.id;
        //next();
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            // req.body.good_company = req.session.comp_id;
            conn.query('update good_info set ? where good_id='+id+' and good_company='+req.session.comp_id,req.body, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
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
        var sql = 'delete from good_info where id='+code + " and good_company="+req.session.comp_id;
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
