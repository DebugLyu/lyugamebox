"use strict";
cc._RFpush(module, '4ad72TODTZKjovbwS0fvWQx', 'OnLogin');
// Script/LoginView/OnLogin.js

"use strict";

var etc = require("etc");
cc.Class({
    extends: cc.Component,

    properties: {
        prefabNormalLogin: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function onLoad() {
        // common.connect();
        var okfunc = function okfunc() {};
        var errorfunc = function errorfunc() {
            var callback = function callback() {};
            cc.ll.notice.addMsg(2, "网络连接错误", callback);
        };
        cc.ll.net.connect(etc.ip, etc.port, okfunc, errorfunc);
    },

    onNormalLoginClick: function onNormalLoginClick() {
        // var scene = cc.director.getScene();
        // if (common.getNetworkState() == 2){
        //     var bg = cc.find("BgLayer");
        //     let creatlayer = cc.instantiate(this.prefabNormalLogin);  
        //     creatlayer.parent = bg;
        //     creatlayer.setPosition(0,0);
        // }else{
        //     common.connectWithFunc( "onNormalLoginClick", this );
        // }
        if (cc.ll.net.state == 2) {
            var bg = cc.find("BgLayer");
            var creatlayer = cc.instantiate(this.prefabNormalLogin);
            creatlayer.parent = bg;
            creatlayer.setPosition(0, 0);
        }
    }
});

cc._RFpop();