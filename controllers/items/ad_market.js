var md5 = require('md5').digest_s;
module.exports = {
    router: "/ad_market/",
    post: function( req, res, next ) {
        next();
    },
    get: function( req, res, next ) {
        log.info( 'api list' );
        var limit = parseInt(req.query.count) || 10;
        var page = parseInt(req.query.page) || 1;
        var start = (page-1)*limit;
        var pos = parseInt(req.query.pos) || 1;
        var good_id = parseInt(req.query.good_id) || 0;
        var sqlCount = 'select count(*) as total from good_info where good_id in (select good_id from advise where pos='+pos+')';
        var sqlList = 'select good_info.*,comp_info.name as company_name,advise.id from good_info,comp_info,advise where good_info.good_id=advise.good_id and advise.pos='+pos+' and good_info.good_company=comp_info.id and good_info.good_id in (select good_id from advise where pos='+pos+')';
        sqlList +=' order by good_id desc limit '+start+','+limit;
        console.log('----------------');
        console.log(sqlCount);
        console.log(sqlList);
        console.log('----------------');
        pool.getConnection(function(err, conn) {

            conn.query(sqlCount, function(err, ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }

                conn.query(sqlList, function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    console.log(ret);
                    if(good_id){
                        datas.forEach(function(item,index){
                            if(item.id == good_id){
                                var temp = item;
                                datas[index] = datas[0];
                                datas[0] = temp;
                                return;
                            }
                        });
                    }
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
