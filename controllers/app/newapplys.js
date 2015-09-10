module.exports = {
    router: "/newapplys/",
    post: function( req, res, next ) {
        next();
    },
    get: function( req, res, next ) {
        var comp_id = req.session.comp_id;
        if(!comp_id){
            return res.json({
                status: 500,
                msg:'params error'
            });
        }
        pool.getConnection(function(err, conn) {
            conn.query('select count(*) as total from comp_map where status=1 and comp_id_1='+comp_id, function(err, ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }

                res.json({
                    total:ret[0].total || 0,
                    status: 200
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
