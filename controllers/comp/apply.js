module.exports = {
    router: "/apply/",
    post: function( req, res, next ) {
        var id = req.body.id;
        if(!id){
            return res.json({
                status: 500,
                msg:"参数错误",
                id:id
            })
        };

        pool.getConnection(function(err, conn) {
            conn.query('select * from comp_info where id='+req.session.comp_id, function(err,datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                var uploadZizhi = true;
                console.log(datas);
                if(!datas || datas.length < 1){
                    uploadZizhi = false;
                }
                ['img_01','img_02','img_03','img_04','img_05'].forEach(function(key){
                    if(!datas[0][key]){
                        uploadZizhi = false;
                    }
                });
                if(uploadZizhi == false){
                    conn.release();
                    return res.json({
                        status: 500,
                        err:"请先上传相关资质"
                    });
                }

                var sql = 'insert into comp_map(comp_id_1, comp_id_2) values('+id+','+req.session.comp_id+')';
                if(req.body.reapply == 1){
                    sql = 'update comp_map set status = 0 where comp_id_1 = '+id+' and comp_id_2='+req.session.comp_id;
                }
                console.log(sql);

                conn.query(sql, function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    res.json({status: 200, data: datas});
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
            var limit = parseInt(req.query.count) || 10;
            var page = parseInt(req.query.page) || 1;
            var start = (page-1)*limit;
            var companyid = parseInt(req.session.comp_id);
            var type = 3-companyid.toString().charAt(0);
            var status = req.query.status;
            var sqlCount, sql;
            var nameFilter = req.query.name ? " name like '%"+decodeURIComponent(req.query.name)+"%' and " : "";

            var insql = type == 2 ? 'select comp_id_1 as id from comp_map where comp_id_2='+companyid
                                    :
                                    'select comp_id_2 as id from comp_map where comp_id_1='+companyid;
            if(status == -1){
                var
                sqlCount = 'select count(*) as total from comp_info where '+nameFilter+' type='+type+' and id not in ('+insql+')';
                sql= 'select * from comp_info where '+nameFilter+' type='+type+' and id not in ('+insql+') limit '+start+','+limit;
            }else if(status == 0){
                sqlCount = 'select count(*) as total from comp_info where type='+type+' and id in ('+insql+' and status = 0)';
                sql = 'select * from comp_info where  type='+type+' and id in ('+insql+' and status = 0) limit '+start+','+limit;
            }else if(status == 1){
                sql = 'select * from comp_info where type='+type+' and id in ('+insql+' and status = 1) limit '+start+','+limit;
                sqlCount = 'select count(*) as total from comp_info where type='+type+' and id in ('+insql+' and status = 1)';
            }else if(status == 2){
                sqlCount = 'select count(*) as total from comp_info where type='+type+' and id in ('+insql+' and status = 2) ';
                sql = 'select comp_info.*,comp_map.deliveryman,comp_map.salesman,comp_map.comp_id_1,comp_map.comp_id_2 from comp_info,comp_map where comp_info.id=comp_map.'+(type==2?'comp_id_1':'comp_id_2')+' and comp_map.'+(type==2?'comp_id_2':'comp_id_1')+'='+req.session.comp_id+' and comp_info.type='+type+' and comp_info.id in ('+insql+' and status = 2) limit '+start+','+limit;
            }else{
                return ret.json({
                    status: 500,
                    msg:'参数错误'
                })
            }
            console.log(sqlCount);
            console.log(sql);
            pool.getConnection(function(err, conn) {
                console.log('mysql 连接成功');
                conn.query(sqlCount, function(err, ret){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    console.log(ret);
                    conn.query(sql, function(err, datas){
                        if(err){
                            return res.json({status: 500, err: err.message});
                        }
                        console.log(ret);
                        res.json({
                            total:(ret[0] && ret[0].total) || 0,
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
        next();
    },
    all: function( req, res, next ) {
        next();
    }
};
