var packet = require( 'Lpackage' )
var msgcode = require( 'Msgcode' )

cc.Class({
    extends: cc.Component,

    properties: {
        IDLabel : cc.EditBox,
        GoldLabel : cc.EditBox,
        NameLabel : cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    onGoldBtnClicked : function(event, data){
        var cur = Number(this.GoldLabel.string) || 0;
        var add = Number( data ) || 0;
        this.GoldLabel.string = cur + add;
        cc.ll.sAudioMgr.playNormalBtnClick(); 
    },

    onCleanBtnClicked: function(){
        this.GoldLabel.string = 0;
        cc.ll.sAudioMgr.playNormalBtnClick(); 
    },

    onNameEditEnd : function( event, data ){
        var id = Number( this.IDLabel.string );
        if( id > 0 ){
            var event = require("LLEvent");
            var self = this;
            var namecallback = function( obj ){
                if( Number(self.IDLabel.string) == obj.id ){
                    self.NameLabel.string = obj.name;
                }
            }
            var index = event.addEvent(namecallback);
            var p = new packet( "ReqCheckName" );
            p.lpack.index = index;
            p.lpack.id = id;
            cc.ll.net.send( p.pack() ); 
        }
    },

    onOkBtnClicked : function( event ){
        var id = Number(this.IDLabel.string);

        if (id <= 0) {
            cc.ll.msgbox.addMsg(msgcode.COMMON_ERROR_ID);
            return;
        }
        var gold = Number( this.GoldLabel.string );
        if( gold <= 0 ){
            cc.ll.msgbox.addMsg(msgcode.COMMON_ERROR_GOLD);
            return;
        }
        var name = this.NameLabel.string;
        if( name.length <= 0 ){
            cc.ll.msgbox.addMsg(msgcode.msgcode.COMMON_ERROR_USER);
            return;
        }
        var okcallback = function(){
            var p = new packet( "ReqTradeGold" );
            p.lpack.toid = id;
            p.lpack.gold = gold;
            cc.ll.net.send( p.pack() ); 
        }
        var str = msgcode.TRANSTFER_SUBMIT_1 + name + msgcode.TRANSTFER_SUBMIT_2 + gold + msgcode.TRANSTFER_SUBMIT_3;
        var node = cc.ll.notice.addMsg(1, str, okcallback, null);
    },

    onLayerDestroy: function(){
        this.node.destroy();
    },
});
