module.exports = {
    router: "/feedback/",
    post: function( req, res, next ) {

        var orderid = req.body.orderid;
        var uid = req.session.uid;
        var feedback  =req.body.feedback;
        if(!uid || !feedback){
            return res.json({
                status: 500,
                err:'错误'
            });
        }
        pool.getConnection(function(err, conn) {
            var sql = "insert into feedback(uid, feedback) values ("+uid+",'"+feedback+"') ";
            var obj = {
                feedback:feedback,
                uid: uid
            }
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({
                    status: 200
                });
            });
            conn.release();
        });

    },
    get: function( req, res, next ) {
        var limit = parseInt(req.query.count) || 10;
        var page = parseInt(req.query.page) || 1;
        var start = (page-1)*limit;
        pool.getConnection(function(err, conn) {
            conn.query('select count(*) as total from feedback', function(err, ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                var csql = 'select * from feedback order by id desc';
                csql += ' limit '+start+','+limit;
                console.log(csql);
                conn.query(csql, function(err, datas){
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
    },
    put: function( req, res, next ) {
        next();
    },
    delete: function( req, res, next ) {
        var id = parseInt(req.params.id);
        if(!id){
            return res.json({status:500, err:'param error'});
        }
        pool.getConnection(function(err, conn) {
            conn.query('delete from feedback where id = '+id, function(err, ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200});
            });
            conn.release();
        });
    },
    all: function( req, res, next ) {
        next();
    }
};
