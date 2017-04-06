var common = require("Common");
var msgbox = require("Msgbox");
var notice = require("Notice")

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
        loadingBar: cc.ProgressBar,
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        setTimeout(function(){
            console.log("aaaaaaaaaaaa");
        }, 10);
        common.init();
        msgbox.getInstance();//初始化弹窗
        notice.getInstance().init();
        cc.loader.loadResDir("resources", function (err, assets) {
            console.log("load resources n = " + assets.length);
        });
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        
    },
});
