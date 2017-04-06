"use strict";
cc._RFpush(module, 'f0d5eIhVlJA3qs0sMVKbvOp', 'Msgbox');
// Script/Common/Msgbox.js

"use strict";

var msgcode = require('Msgcode');
var msg = function () {

    var instance = null;
    function getInstance() {
        if (instance === null) {
            instance = new MsgBox();
        }
        return instance;
    }
    function MsgBox() {
        this.bg = null;
        //常驻背景到内存中
        cc.game.addPersistRootNode(this.bg);
        this.addMsg = function (msg) {
            if (this.bg === null) {
                this.bg = cc.find("MsgBoxLayer");
                if (this.bg === null) return;
            }
            if (typeof msg == "number") {
                msg = msgcode[msg];
            }
            var msgnode = new cc.Node();
            msgnode.color = cc.color(0, 255, 68, 255);
            var msglabel = msgnode.addComponent(cc.Label);
            msglabel.string = msg;
            msglabel.fontSize = 20;
            msgnode.setPosition(0, -this.bg.height / 2 + 10);
            msgnode.parent = this.bg;
            var dellabel = function dellabel() {
                msgnode.destroy();
            };
            var act1 = cc.moveBy(1, cc.p(0, 100));
            var act21 = cc.delayTime(0.5);
            var act22 = cc.fadeOut(0.5);
            var act23 = cc.callFunc(dellabel);
            var act2 = cc.sequence(act21, act22, act23);

            msgnode.runAction(act1);
            msgnode.runAction(act2);
        };
    }
    return {
        getInstance: getInstance
    };
}();

module.exports = msg;

cc._RFpop();