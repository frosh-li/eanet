
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
                    {url:'role_list', val:"角色"},
                    {url:'category_list', val:"分类管理"}
                ];
            }else if(req.session.role_type == 1){
                // 批发企业
                menus = [
                    {url:'hot_list', val:"新品推荐"},
                    {url:'item_list', val:"药品目录"},
                    {url:'order_list/1', val:"订单管理"},
                    {url:'originOrder_list', val:"历史订单"},
                    {url:'push_list', val:"促销管理"}
                ];
            }else if(req.session.role_type == 2){
                // 药店
                menus = [
                    {url:'hot_list', val:"新品推荐"},
                    {url:'yd_order_list/1', val:"订单管理"},
                    {url:'originOrder_list', val:"历史订单"},
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
