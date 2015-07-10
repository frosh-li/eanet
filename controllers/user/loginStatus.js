
var md5 = require( 'md5' ).digest_s;
module.exports = {
    router: "/loginStatus/",
    post: function( req, res, next ) {
        if(req.session.username){
            var menus = [];
            if(req.session.role_type == 0){
                menus = [
                    {url:'comp_list', val:"企业管理"},
                    {url:'user_list', val:"用户管理"},
                    {url:'role_list', val:"角色"}
                ];
            }else if(req.session.role_type == 1){
                // 批发企业
                menus = [
                    {url:'item_list', val:"药品目录"},
                    {url:'order_list/0', val:"订单管理"}
                ];
            }else if(req.session.role_type == 2){
                // 药店
                menus = [
                    {url:'yd_order_list/0', val:"订单管理"},
                    {url:'market_list', val:"药品市场"}
                ];
            }
            res.json({status: 200, data: req.session, menus: menus});
        }else{
            res.json({status: 500, msg:"请先登录"});
        }


    },
    get: function( req, res, next ) {
        next();
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
