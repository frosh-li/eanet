var nodeExcel = require('excel-export');
module.exports = {
    router: "/orderexcel/",
    post: function( req, res, next ) {
        next();
    },
    get: function( req, res, next ) {

        var code = req.params.id;
        if ( !code ) {
            console.log(code);
            res.json({status:600});
        } else {
            var conf ={};
            conf.cols = [{
                caption:'ID',
                type:'number'
            },{
                caption:'药品ID',
                type:'number'
            },{
                caption:'药品名称',
                type:'string'
            },{
                caption:'药品规格',
                 type:'string'
            },{
                caption:"单位",
                type:"string"
            },{
                caption:"厂牌",
                type:"string"
            },{
                caption:"批准文号",
                type:"string"
            },{
                caption:"订货数量",
                type:"number"
            },{
                caption:"价格",
                type:"number"
            },{
                caption:"总金额",
                type:"number"
            },{
                caption:"主表基础字段",
                type:'string'
            },{
                caption:"",
                type:"string"
            }
            ];
            pool.getConnection(function(err, conn) {
                conn.query('select * from ordermaster where order_id="'+code+'"', function(err, master){
                    if(err){
                        return res.end('请求数据错误'+err.message);
                    }
                    /*
                    订单编号
                    供货商编号
                    订货人
                    订单备注
                    订单日期
                    最迟送货时间
                    订单状态
                    订单类型
                    药店编号
                    */
                    var dd = [];
                    master.forEach(function(m){
                        dd.push(['订单编号', m.order_id]);
                        //dd.push(['供货商编号', m.order_id]);
                        dd.push(['订货人', m.order_oper]);
                        dd.push(['订单备注', m.order_beizu]);
                        dd.push(['订单日期', m.order_date]);
                        dd.push(['最迟送货时间', m.order_lastvaiddate]);
                        dd.push(['订单类型', m.order_type == 1 ? '直接订单':"询价订单"]);
                        dd.push(['药店编号', m.comp_id]);
                    });
                    conn.query('select oid, good_id, good_name, good_gg,good_dw,good_cp, good_pzwh, good_number, good_price, good_amount from orderdetail where order_id="'+code+'"',function(err, datas){
                        if(err){
                            return res.end('请求数据错误'+err.message);
                        }
                        conf.rows = [];
                        var maxCols = 0;
                        datas.forEach(function(data){
                            var r = [];
                            maxCols = 0;
                            for(var key in data){
                                r.push(data[key]);
                                maxCols++;
                            }
                            conf.rows.push(r);
                        })
                        console.log(datas);

                        for(var index = 0 ; index < 7 ; index++){
                            var col1 = "",
                                col2 = "";
                            if(dd[index]){
                                col1 = dd[index][0];
                                col2 = dd[index][1];
                            }
                            if(conf.rows[index] == undefined){
                                conf.rows[index] = [];
                                for(var i = 0 ; i < maxCols ; i++){
                                    conf.rows[index].push("");
                                }

                            }
                            conf.rows[index].push(col1, col2);
                        }
                        console.log(JSON.stringify(conf.rows));
                        var result = nodeExcel.execute(conf);
                        conn.query('update ordermaster set order_status = 6 where order_id="'+code+'"', function(err, u){
                            if(err){
                                return res.end('请求数据错误'+err.message);
                            }
                            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                            res.setHeader("Content-Disposition", "attachment; filename=" + code+".xlsx");
                            res.end(result, 'binary');
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
