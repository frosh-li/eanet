var path = require('path');
var fs = require('fs');

module.exports = {
    router: "/upload/",
    post: function( req, res, next ) {
        console.log('session');
        console.log(req.session);
        var orderid = req.body.orderid;
        var data = _.pick(req.body, 'type')
            , uploadPath = path.normalize('./uploads')
            , file = req.files.file;

            console.log(file.name); //original name (ie: sunset.png)
            console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
            console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
            req.session.uploadFile = file.path;
            // fs.unlink(file.path);
            // connection.release();
            res.json({
                status: 200,
                path: file.path
            })
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
