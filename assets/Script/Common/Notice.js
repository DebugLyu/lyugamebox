var msgcode = require( 'Msgcode' )

var NoticeBox = cc.Class({
    // extends: cc.Component,
    properties: {

    },
    statics: {
        pfab : null,
        init : function() {
            var self = this;
            cc.loader.loadRes("profab/Notice", function (err, prefab) {
                self.pfab = prefab;
            });
        },
        addMsg : function(type, msg, okfunc, cancelfunc, tag){
            var node = cc.instantiate(pfab);

            var msgnode = node.getChildByName("NoticeBg").getChildByName("NoticeLabel");
            var msglabel = msgnode.getComponent(cc.Label);
            msglabel.string = msg;

            var onDestroy = function(){
                node.destroy();
            };

            var okbtn = node.getChildByName("NoticeBg").getChildByName("OkBtn");
            var okcallback = function() {
                if (okfunc != null) {
                    okfunc();
                }
                onDestroy();
            };
            okbtn.on('click', okcallback);

            var cancelbtn = node.getChildByName("NoticeBg").getChildByName("CancelBtn");
            var cancelcallback = function(){
                if(cancelfunc != null){
                    cancelfunc();
                }
                onDestroy();
            };
            cancelbtn.on('click', cancelcallback);

            if( type == 2 ){
                cancelbtn.active = false;
                okbtn.x = 0;
            }
            cc.director.getScene().addChild(node,99,tag);
        },

        removeMsg : function(tag){
            cc.director.getScene().removeChildByTag( tag )
        },
    },
});
module.exports = NoticeBox;