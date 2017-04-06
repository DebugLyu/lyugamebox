"use strict";

var NoticeBox = function () {

    var instance = null;
    function getInstance() {
        if (instance === null) {
            instance = new NoticeBox();
        }
        return instance;
    }
    var pfab = null;
    function NoticeBox() {
        this.init = function () {
            cc.loader.loadRes("profab/Notice", function (err, prefab) {
                pfab = prefab;
            });
        };

        this.addMsg = function (type, msg, okfunc, cancelfunc, tag) {
            var node = cc.instantiate(pfab);

            var msgnode = node.getChildByName("NoticeBg").getChildByName("NoticeLabel");
            var msglabel = msgnode.getComponent(cc.Label);
            msglabel.string = msg;

            var onDestroy = function onDestroy() {
                node.destroy();
            };

            var okbtn = node.getChildByName("NoticeBg").getChildByName("OkBtn");
            var okcallback = function okcallback() {
                if (okfunc != null) {
                    okfunc();
                }
                onDestroy();
            };
            okbtn.on('click', okcallback);

            var cancelbtn = node.getChildByName("NoticeBg").getChildByName("CancelBtn");
            var cancelcallback = function cancelcallback() {
                if (cancelfunc != null) {
                    cancelfunc();
                }
                onDestroy();
            };
            cancelbtn.on('click', cancelcallback);

            if (type == 2) {
                cancelbtn.active = false;
                okbtn.x = 0;
            }
            cc.director.getScene().addChild(node, 99, tag);
        };

        this.removeMsg = function (tag) {
            cc.director.getScene().removeChildByTag(tag);
        };
    }
    return {
        getInstance: getInstance
    };
}();

module.exports = NoticeBox;