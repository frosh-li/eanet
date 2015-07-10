var md5 = require('md5').digest_s;
module.exports = {
    router: "/market/",
    post: function( req, res, next ) {
        next();
    },
    get: function( req, res, next ) {
        log.info( 'api list' );
        var limit = parseInt(req.query.count) || 10;
        var page = parseInt(req.query.page) || 1;
        var start = (page-1)*limit;
        pool.getConnection(function(err, conn) {
            conn.query('select count(*) as total from good_info', function(err, ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }

                conn.query('select * from good_info limit '+start+','+limit, function(err, datas){
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
        next();
    },
    all: function( req, res, next ) {
        next();
    }
};
