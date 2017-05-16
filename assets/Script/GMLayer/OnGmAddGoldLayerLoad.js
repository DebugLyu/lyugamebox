var packet = require( "Lpackage" )
var msgcode = require( 'Msgcode' )
cc.Class({
    extends: cc.Component,

    properties: {
        NameLabel : cc.EditBox,
        GoldLabel : cc.EditBox,
        LogBtnList : [cc.Button],
        _logType : 0,
    },

    // use this for initialization
    onLoad: function () {
        for (var i = this.LogBtnList.length - 1; i >= 0; i--) {
            var btn = this.LogBtnList[i];
            if( i == 0 ){
                btn.interactable = false;
                this._logType = 1;
            }else{
                btn.interactable = true;
            }
        }
    },

    onGoldBtnClicked : function(event, data){
        var cur = Number(this.GoldLabel.string) || 0;
        var add = Number( data ) || 0;
        this.GoldLabel.string = cur + add;
        cc.ll.sAudioMgr.playNormalBtnClick(); 
    },

    onLogBtnClicked : function( event, data ){
        for (var i = 0; i < this.LogBtnList.length; i++) {
            var btn = this.LogBtnList[i];
            if( i+1 == data ){
                btn.interactable = false;
                this._logType = Number(data)||1;
            }else{
                btn.interactable = true;
            }
        }
        cc.ll.sAudioMgr.playNormalBtnClick(); 
    },

    onCleanBtnClicked: function(){
        this.GoldLabel.string = 0;
        cc.ll.sAudioMgr.playNormalBtnClick(); 
    },

    onOkBtnClicked : function( event ){
        var name = Number(this.NameLabel.string);
        if (name<=0) {
            cc.ll.msgbox.addMsg(msgcode.COMMON_ERROR_ID);
            return;
        }
        var gold = Number( this.GoldLabel.string );
        if( gold <= 0 ){
            cc.ll.msgbox.addMsg(msgcode.COMMON_ERROR_GOLD);
            return;
        }

        var p = new packet( "ReqAddGold" );
        p.lpack.id = name;
        p.lpack.gold = gold;
        p.lpack.logtype = this._logType;
        cc.ll.net.send( p.pack() ); 
        cc.ll.sAudioMgr.playNormalBtnClick(); 
        cc.ll.loading.addLoading(3);
        this.onLayerDestroy();
    },

    onLayerDestroy: function(){
        this.node.destroy();
    },
});
