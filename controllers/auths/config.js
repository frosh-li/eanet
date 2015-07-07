function getApis() {
    return "";
}

module.exports = {
    "module": "auths",
    "moduleName": "权限管理",
    "menus": [
        {
            "name": "新建用户",
            "url": "/auths/newuser"
        },
        {
            "name": "权限组列表",
            "url": "/auths/group"
        },
        {
            "name": "用户列表",
            "url": "/auths/users"
        },
        {
            "name": "访问API列表",
            "url": "/auths/apis"
        }
    ],
    "api": getApis()
};

