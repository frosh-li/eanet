module.exports = {
    router: "/comp/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            conn.query('insert into comp_info set ?',req.body, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
    },
    get: function( req, res, next ) {
        var code = req.params.id;
        if ( code ) {
            var sql = "select * from comp_info where id="+code;
            pool.getConnection(function(err, conn) {
                conn.query(sql, function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    res.json({status: 200, data: datas[0]});
                });
                conn.release();
            });
        } else {
            log.info( 'api list' );
            var limit = parseInt(req.query.count) || 10;
            var page = parseInt(req.query.page) || 1;
            var start = (page-1)*limit;
            var sql = 'select count(*) as total from comp_info';

            var sql2 = 'select * from comp_info';
            var hasWhere = false;
            var whereQuery = [];
            if(req.query.type && req.query.type > 0){
                if(!hasWhere){
                    sql += " where ";
                    sql2 += " where ";
                    hasWhere = true;
                }
                whereQuery.push(" type="+parseInt(req.query.type)+" ");
            }
            console.log(req.query.name);
            ['id', 'name', 'pingying'].forEach(function(key){
                if(req.query[key] === undefined){
                    return;
                }
                if(!hasWhere){
                    sql += " where ";
                    sql2 += " where ";
                    hasWhere = true;
                }
                whereQuery.push(' '+key+' like "%'+decodeURIComponent(req.query[key])+'%" ');
            });
            if(whereQuery.length > 0){
                sql += " "+whereQuery.join('and') + " ";
                sql2 += " " +whereQuery.join('and') + " ";
            }

            console.log(sql, sql2);
            sql2 += ' order by create_date desc limit '+start+','+limit;
            pool.getConnection(function(err, conn) {
                console.log('mysql 连接成功');
                conn.query(sql, function(err, ret){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }

                    conn.query(sql2, function(err, datas){
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
        pool.getConnection(function(err, conn) {
            delete req.body.id;
            delete req.body.type;
            var code = req.params.id;
            delete req.body.create_date;
            conn.query('update comp_info set ? where id='+code,req.body, function(err, datas){
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
