var common = require('Common');
var msgbox = require('Msgbox')

cc.Class({
    extends: cc.Component,
    
    properties: {
        prefabNormalLogin:{
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad: function () {
        common.connect();
    },

    onNormalLoginClick:function(){
        // var scene = cc.director.getScene();
        if (common.getNetworkState() == 2){
            var bg = cc.find("BgLayer");
            let creatlayer = cc.instantiate(this.prefabNormalLogin);  
            creatlayer.parent = bg;
            creatlayer.setPosition(0,0);
        }else{
            common.connectWithFunc( "onNormalLoginClick", this );
        }
    },
});