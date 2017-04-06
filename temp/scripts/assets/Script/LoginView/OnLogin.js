"use strict";
cc._RFpush(module, '4ad72TODTZKjovbwS0fvWQx', 'OnLogin');
// Script/LoginView/OnLogin.js

'use strict';

var common = require('Common');
var msgbox = require('Msgbox');

cc.Class({
    extends: cc.Component,

    properties: {
        prefabNormalLogin: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function onLoad() {
        common.connect();
    },

    onNormalLoginClick: function onNormalLoginClick() {
        // var scene = cc.director.getScene();
        if (common.getNetworkState() == 2) {
            var bg = cc.find("BgLayer");
            var creatlayer = cc.instantiate(this.prefabNormalLogin);
            creatlayer.parent = bg;
            creatlayer.setPosition(0, 0);
        } else {
            common.connectWithFunc("onNormalLoginClick", this);
        }
    }
});

cc._RFpop();