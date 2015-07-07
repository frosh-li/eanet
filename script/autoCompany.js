var mysql = require('mysql');
global.pool  = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'med'
});
var insertMax = 100;
pool.getConnection(function(err, connection) {
    console.log('mysql 连接成功');
	insert(connection);
    // connection.release();
});


function insert(connection){
	if(insertMax <=0){
		console.log('100条记录插入结束');
		return;
	}
	var startId = [100000, 200000][Math.random()*2 >> 0];
	var autoID = Math.random()*100000 >> 0;
	var id = startId + autoID;
	var comp = {
		type: (Math.random()*2 >> 0) + 1,
		name: "中国药业",
		shortname:"重要",
		pingying: "zgye",
		address: "北京市通州区",
		city: "北京市",
		contact: "北京",
		email: "beijing@163.com",
		fax: "89899494",
		telephone: "13581846799",
		mobile: "15330066919",
		website: "http://www.baidu.com",
		zipcode: "100000",
		password: "123456",
		status: Math.random()*2 >> 0
	};
	var sql = "insert into comp_info set ? ";
	connection.query(sql, comp, function(err){
		if(err){
			console.log('插入失败', err.message);
			return insert(connection);
		}
		insertMax--;
		insert(connection);
	});
}
