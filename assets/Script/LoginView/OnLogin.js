var etc = require("etc")
var msgcode = require( 'Msgcode' )

cc.Class({
    extends: cc.Component,
    
    properties: {
        prefabNormalLogin:{
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad: function () {
        // common.connect();
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = cc.find("Canvas").getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }

        var okfunc = function(){

        }
        var errorfunc = function() {
            var callback = function(){
                var scenename = cc.director.getScene().name;
                if( scenename == "loadingview" || scenename == "loginview"){
                    return;
                }
                cc.ll.sSceneMgr.onChangeScene("loginview");
            }
            cc.ll.notice.addMsg (2,msgcode.NETWORK_UNCONNECT,callback)
        }
        cc.ll.net.connect( etc.ip, etc.port, okfunc, errorfunc );


        var size = cc.ll.sAudioMgr.getSize()
        var node = cc.find( "Canvas/BgLayer/SettingBtn" )
        var closeimg = node.getChildByName( "Close" );
        closeimg.active = size == 0;
        cc.ll.sAudioMgr.playBGM("bgm"); 
    },

    onNormalLoginClick:function(){
        var self = this;
        var showLogin = function(){
            var bg = cc.find("Canvas/BgLayer");
            let creatlayer = cc.instantiate(self.prefabNormalLogin);  
            creatlayer.parent = bg;
            creatlayer.setPosition(0,0);
        }
        if ( cc.ll.net.state == 2 ) {
            showLogin();
        }else{
            var callback = function(){
                var okfunc = function(){
                    showLogin();
                }
                var errorfunc = function(){
                    cc.ll.notice.addMsg(2,msgcode.NETWORK_UNCONNECT,null)        
                }
                cc.ll.net.connect( etc.ip, etc.port, okfunc, errorfunc );
            }
            cc.ll.notice.addMsg(2,msgcode.NETWORK_UNCONNECT,callback)
        }
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