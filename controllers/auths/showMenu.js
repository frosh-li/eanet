var menu = require( "./config.js" );
module.exports = function( req, res, next ) {
log.info( 'show menu' );
res.json( menu.menus );
};