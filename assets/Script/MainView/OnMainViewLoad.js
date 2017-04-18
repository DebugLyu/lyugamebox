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
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = cc.find("Canvas").getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(cc.ll.pMgr.main_role !== null){
            this.NameLabel.string = cc.ll.pMgr.main_role.name + " [" + cc.ll.pMgr.main_role.id + "]";
            this.GoldLabel.string = cc.ll.pMgr.main_role.gold;
        }

        var size = cc.ll.sAudioMgr.getSize()
        var node = cc.find( "Canvas/MainBgLayer/MainBg/SettingBtn" )
        var closeimg = node.getChildByName( "Close" );
        closeimg.active = size == 0;
        cc.ll.sAudioMgr.playBGM("bgRace");
    },

    onGameBtnClick: function () {
        var p = new packet( "ReqEnterRoom" );
        p.lpack.roomid = 99;
        cc.ll.net.send( p.pack() );
        cc.ll.loading.addLoading(20);
        cc.ll.sAudioMgr.playNormalBtnClick();
    },
    onSettingClick : function(event) {
        var node = event.target;
        var closeimg = node.getChildByName( "Close" );
        closeimg.active = !closeimg.active;
        cc.ll.sAudioMgr.setSize( closeimg.active?0:1 );
        cc.ll.sAudioMgr.playNormalBtnClick();
    },
});
