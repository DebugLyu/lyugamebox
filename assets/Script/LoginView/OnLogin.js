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
        var okfunc = function(){

        }
        var errorfunc = function() {
            var callback = function(){
                var scenename = cc.director.getScene().name;
                if( scenename == "" || scenename == "loadingview" || scenename == "loginview"){
                    return;
                }
                var sSceneMgr = require("SceneManager");
                sSceneMgr.onChangeScene("loginview");
            }
            cc.ll.notice.addMsg (2,msgcode.NETWORK_UNCONNECT,callback)
        }
        cc.ll.net.connect( etc.ip, etc.port, okfunc, errorfunc );
    },

    onNormalLoginClick:function(){
        // var scene = cc.director.getScene();
        // if (common.getNetworkState() == 2){
        //     var bg = cc.find("BgLayer");
        //     let creatlayer = cc.instantiate(this.prefabNormalLogin);  
        //     creatlayer.parent = bg;
        //     creatlayer.setPosition(0,0);
        // }else{
        //     common.connectWithFunc( "onNormalLoginClick", this );
        // }
        if ( cc.ll.net.state == 2 ) {
            var bg = cc.find("BgLayer");
            let creatlayer = cc.instantiate(this.prefabNormalLogin);  
            creatlayer.parent = bg;
            creatlayer.setPosition(0,0);
        }
    },
});