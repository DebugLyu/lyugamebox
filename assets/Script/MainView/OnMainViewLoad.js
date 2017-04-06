var common = require('Common')
var pMgr = require("PlayerManager").getInstance();
var msgbox = require('Msgbox')
var packet = require( 'Lpackage' )

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
    },

    // use this for initialization
    onLoad: function () {
        if(pMgr.main_role !== null){
            this.NameLabel.string = pMgr.main_role.name;
            this.GoldLabel.string = pMgr.main_role.gold;
        }
    },

    onGameBtnClick: function () {
        var p = new packet( "ReqEnterRoom" );
        p.lpack.roomid = 99;
        common.send( p.pack() );
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
