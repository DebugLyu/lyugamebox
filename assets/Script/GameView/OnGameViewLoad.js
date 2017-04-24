var packet = require( 'Lpackage' )
var msgcode = require( 'Msgcode' )
var TuiBingConfig = require("TuiBingConfig")

cc.Class({
    extends: cc.Component,

    properties: {
        NameLabel: {
            default: null,
            type: cc.Label,
        },
        GoldLabel: {
            default: null,
            type: cc.Label,
        },

        BankerBtns : [cc.Button],
        bankerLabel : cc.Label, 
        bankerDialog : cc.Prefab,

        _logic : null,
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = cc.find("Canvas").getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }

        if(cc.ll.pMgr.main_role !== null){
            this.NameLabel.string = cc.ll.pMgr.main_role.name + " [" + cc.ll.pMgr.main_role.id + "]";
            this.GoldLabel.string = cc.ll.pMgr.main_role.gold;
        }

        var node = this.GoldLabel.node;

        cc.ll.pMgr.main_role.register("GoldChange",  node, function(event){
            var gold = event.getUserData()     
            var label = node.getComponent(cc.Label);
            label.string = gold;
        })
        var event = require("LLEvent");
        event

        this._logic = this.node.getComponent( "GameLogic" )
        cc.ll.sAudioMgr.playBGM("bgBet");
        cc.ll.loading.removeLoading();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onBackClicked: function() {
        var p = new packet( "ReqLeaveRoom" );
        cc.ll.net.send( p.pack() );

        cc.ll.sSceneMgr.onChangeScene("mainview");
        cc.ll.sAudioMgr.playNormalBtnClick();
    },
    
    onBeBankerClicked: function() {
        var res = this._logic.canBeBanker();
        if( res != 0){
            cc.ll.msgbox.addMsg(res);
            return;
        }
        if(cc.ll.pMgr.main_role.gold < TuiBingConfig.BankerLessGold){
            cc.ll.msgbox.addMsg( msgcode.GOLD_NOT_ENOUGH );
            return;
        }
        var dialog = cc.instantiate(this.bankerDialog);  
        var bg = cc.find( "Canvas" );
        dialog.parent = bg;

        cc.ll.sAudioMgr.playNormalBtnClick();
    },

    onShowKeepBanker : function(){
        if(cc.ll.pMgr.main_role.gold < TuiBingConfig.BankerLessGold){
            var p = new packet( "ReqKeepBanker" );
            p.lpack.iskeep = 1;
            p.lpack.gold = 0;
            cc.ll.net.send( p.pack() );
            cc.ll.msgbox.addMsg( msgcode.GOLD_NOT_ENOUGH );
            return;
        }
        
        var bg = cc.find( "Canvas" );
        var tmp = bg.getChildByName( "BeBankerDialog" );
        if( tmp == null ){
            var dialog = cc.instantiate(this.bankerDialog);
            var logic = dialog.getComponent( "OnBankerLayerLoad" );
            logic.initKeep();
            dialog.parent = bg;
        }
    },

    unShowKeepBanker : function() {
        var bg = cc.find( "Canvas" );
        var tmp = bg.getChildByName( "BeBankerDialog" );
        if( tmp != null ){
            tmp.destroy();
        }
    },

    onFastBeBankerClicked: function() {
        var p = new packet( "ReqBeBanker" );
        p.lpack.type = 2;
        cc.ll.net.send( p.pack() );
        cc.ll.sAudioMgr.playNormalBtnClick();
    },

    onAddGoldBtnClicked: function(){
        // var p = new packet( "ReqAddGold" );
        // p.lpack.id = cc.ll.pMgr.main_role.id;
        // p.lpack.gold = 100000;
        // p.lpack.logtype = 901;
        // cc.ll.net.send( p.pack() ); 
        cc.ll.msgbox.addMsg( msgcode.GM_CALL_GM );
        cc.ll.sAudioMgr.playNormalBtnClick(); 
    },

    onUnBankerBtnClick : function (){
        var okcallback = function(){
            var p = new packet( "ReqTuiBingUnbanker" );
            cc.ll.net.send( p.pack() );  
        }
        var cancelcallback = function(){
            //do nothing
        }
        cc.ll.sAudioMgr.playNormalBtnClick();
        cc.ll.notice.addMsg(1,msgcode.TUIBING_ASK_UNBANKER, okcallback, cancelcallback, 998);
    },

    onLeaveQueueBtnClick : function() {
        var p = new packet( "ReqTuibingLeaveQueue" );
        cc.ll.net.send( p.pack() );  
        cc.ll.sAudioMgr.playNormalBtnClick();
    },

    onAllPlayerClick : function(){
        var node = cc.find("Canvas/GameBgLayer/AllPlayerList");
        node.active = !node.active;
        if (node.active == true) {
            var child = cc.find("pview/pcontent", node);
            child.removeAllChildren();
            var p = new packet( "ReqTuiBingAllPlayer" );
            cc.ll.net.send( p.pack() );  
        }

        cc.ll.sAudioMgr.playNormalBtnClick();
    },

    onKeepBankerBtnClick : function(){
        if(cc.ll.pMgr.main_role.gold < TuiBingConfig.BankerLessGold){
            cc.ll.msgbox.addMsg( msgcode.GOLD_NOT_ENOUGH );
            return;
        }
        
        var bg = cc.find( "Canvas" );
        var tmp = bg.getChildByName( "BeBankerDialog" );
        if( tmp == null ){
            var dialog = cc.instantiate(this.bankerDialog);
            var logic = dialog.getComponent( "OnBankerLayerLoad" );
            logic.initKeep();
            dialog.parent = bg;
        }
    },

    showUnBankerTips : function(){
        this.bankerLabel.node.active = true;
        for (var i = this.BankerBtns.length - 1; i >= 0; i--) {
            var btn = this.BankerBtns[i];
            btn.node.active = false;
        }
        this._logic._unBankerFlag = true;
    },
});
