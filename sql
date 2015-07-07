db.users.insert{ "auth" : [  "/" ], "created" : ISODate("2015-04-14T06:06:18.003Z"), "lastlogin" : ISODate("2015-04-15T05:51:20.462Z"), "password" : "123456", "platformid" : "1", "platformname" : "主平台", "token" : "70e153d0-e333-11e4-9643-3dbf063b2cc6", "username" : "admin" }

db.groups.insert({"name": "超级管理员", apilist:[{'url': ['/'], 'method': '*'}]})

db.groups.ensureIndex({name: 1},{unique: true});
