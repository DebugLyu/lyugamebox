var pMgr = require("PlayerManager").getInstance();
var packet = require( 'Lpackage' )
var sSceneMgr = require("SceneManager")
var msgcode = require( 'Msgcode' )

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

        _logic : null,
    },

    // use this for initialization
    onLoad: function () {
        if(pMgr.main_role !== null){
            this.NameLabel.string = pMgr.main_role.name;
            this.GoldLabel.string = pMgr.main_role.gold;
        }

        var node = this.GoldLabel.node;
        pMgr.main_role.register("GoldChange",  node, function(event){
            var gold = event.getUserData()     
            var label = node.getComponent(cc.Label);
            label.string = gold;
        })

        this._logic = this.node.getComponent( "GameLogic" )
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onBackClicked: function() {
        var p = new packet( "ReqLeaveRoom" );
        cc.ll.net.send( p.pack() );

        sSceneMgr.onChangeScene("mainview");
    },
    
    onBeBankerClicked: function() {
        var res = this._logic.canBeBanker();
        if( res != 0){
            cc.ll.msgbox.addMsg(res);
            return;
        }
        var okcallback = function(){
            var p = new packet( "ReqBeBanker" );
            p.lpack.type = 2;
            cc.ll.net.send( p.pack() );   
        }
        var cancelcallback = function(){
            var p = new packet( "ReqBeBanker" );
            p.lpack.type = 1;
            cc.ll.net.send( p.pack() ); 
        }
        cc.ll.notice.addMsg (1, msgcode.TUIBING_BANKER_TYPE, okcallback, cancelcallback)     
    },

    onFastBeBankerClicked: function() {
        var p = new packet( "ReqBeBanker" );
        p.lpack.type = 2;
        cc.ll.net.send( p.pack() );        
    },

    onAddGoldBtnClicked: function(){
        var p = new packet( "ReqAddGold" );
        p.lpack.gold = 100000;
        cc.ll.net.send( p.pack() );  
    },

    onUnBankerBtnClick : function (){
        var p = new packet( "ReqTuiBingUnbanker" );
        cc.ll.net.send( p.pack() );   
    },

    onLeaveQueueBtnClick : function() {
        var p = new packet( "ReqTuibingLeaveQueue" );
        cc.ll.net.send( p.pack() );  
    },
});
