var common = require('Common')
var pMgr = require("PlayerManager").getInstance();
var msgbox = require('Msgbox')
var packet = require( 'Lpackage' )
var sSceneMgr = require("SceneManager")

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        
        NameLabel: {
            default: null,
            type: cc.Label,
        },
        GoldLabel: {
            default: null,
            type: cc.Label,
        },
        testmajiang:{
            default: null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        if(pMgr.main_role !== null){
            this.NameLabel.string = pMgr.main_role.name;
            this.GoldLabel.string = pMgr.main_role.gold;
        }
        this.onOpenMajiang( this.testmajiang );

        var node = this.GoldLabel.node;
        pMgr.main_role.register("GoldChange",  node, function(event){
            var gold = event.getUserData()     
            var label = node.getComponent(cc.Label);
            label.string = gold;
        })
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onBackClicked: function() {
        var p = new packet( "ReqLeaveRoom" );
        common.send( p.pack() );

        sSceneMgr.onChangeScene("mainview");
    },

    onOpenMajiang: function( node ) {
        if (node) {

        }
    },
    
    onBeBankerClicked: function() {
        var p = new packet( "ReqBeBanker" );
        p.lpack.type = 1;
        common.send( p.pack() );        
    },
});
