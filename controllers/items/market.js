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
        var ifhot = req.query.hot == 1 ? true: false;
        var catid = req.query.catid;
        var sqlCount = 'select count(*) as total from good_info'+(ifhot? " where good_new=1":"");

        var sqlList = 'select good_info.*,comp_info.name as company_name from good_info,comp_info where good_info.good_company=comp_info.id '
         //sqlList +=(ifhot ? " and good_new = 1 ": "")+' order by good_id desc limit '+start+','+limit;

        if(catid > 0){
            if(ifhot){
                sqlCount += ' and good_info.good_cat in (select id from good_cat where id in(select id from good_cat WHERE id='+catid+' or parent_id='+catid+') or parent_id in(select id from good_cat WHERE id='+catid+' or parent_id='+catid+'))';
                sqlList += ' and good_info.good_cat in (select id from good_cat where id in(select id from good_cat WHERE id='+catid+' or parent_id='+catid+') or parent_id in(select id from good_cat WHERE id='+catid+' or parent_id='+catid+'))';
            }else{
                sqlCount += ' where good_info.good_cat in (select id from good_cat where id in(select id from good_cat WHERE id='+catid+' or parent_id='+catid+') or parent_id in(select id from good_cat WHERE id='+catid+' or parent_id='+catid+'))';
                sqlList += ' and good_info.good_cat in (select id from good_cat where id in(select id from good_cat WHERE id='+catid+' or parent_id='+catid+') or parent_id in(select id from good_cat WHERE id='+catid+' or parent_id='+catid+'))';
            }
        }
        if(req.query.good_name){
            var decodeGoodName = decodeURIComponent(req.query.good_name)
            if(sqlCount.indexOf('where') > -1){


                sqlCount += ' and good_info.good_name like "%'+decodeGoodName+'%" or good_info.good_py like "%'+decodeGoodName+'%"';

            }else{
                sqlCount += ' where good_info.good_name like "%'+decodeGoodName+'%" or good_info.good_py like "%'+decodeGoodName+'%"';
            }
            sqlList += ' and good_info.good_name like "%'+decodeGoodName+'%" or good_info.good_py like "%'+decodeGoodName+'%"';
        }
        if(req.query.good_promotion && req.query.good_promotion == 1){
            if(sqlCount.indexOf('where') > -1){
                sqlCount += ' and good_info.good_promotion != ""';

            }else{
                sqlCount += ' where good_info.good_promotion != ""';
            }
            sqlList += ' and good_info.good_promotion != ""';
        }
        sqlList +=(ifhot ? " and good_new = 1 ": "")+' order by good_id desc limit '+start+','+limit;
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
