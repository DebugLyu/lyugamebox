var ProtoBuf = require("protobuf")
var etc = require("etc");
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
        tips: cc.Label,

        _isLoading : false,
        _stateStr:"",
        _loadkey : 0,
        _loadingList:[cc.String],
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        this.loadingBar.totalLength = this.loadingBar.node.width;

        cc.ll = {};
        // 初始化网络
        cc.ll.net = require("Lwebsocket");
        cc.ll.net.init();

        // cc.ll.common = require("Common");

        cc.loader.loadRes("gamebox", function (err, arr){
            cc.ll.pb = ProtoBuf.protoFromString(arr); 
        });
        // common.init();
        //cc.ll.msgbox;//初始化弹窗
        cc.ll.msgbox = require("Msgbox");
        cc.ll.notice = require("Notice");
        cc.ll.notice.init();

        this._loadingList = ["loading","erguotou","login","main","profab","res_common"];
        this.onLoadNext();
    },

    onLoadComplete:function(){
        this._isLoading = false;
        this._stateStr = "准备登陆";
        cc.director.loadScene("loginview");
        cc.loader.onComplete = null;
    },

    onLoadNext : function () {
        if(this._loadkey >= this._loadingList.length){
            this.onLoadComplete();
        }else{
            var name = this._loadingList[ this._loadkey ];
            this.startPreloading( name );
        }
        this._loadkey = this._loadkey + 1;
    },

    startPreloading:function(name){
        this._stateStr = "正在加载"+name+"，请稍候";
        this._isLoading = true;
        var self = this;
        
        cc.loader.onProgress = function ( completedCount, totalCount,  item ){
            // console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
            if(self._isLoading){
                self._progress = completedCount/totalCount;
                self.loadingBar.progress = self._progress;
            }
        };
        
        cc.loader.loadResDir(name, function (err, assets) {
            self.onLoadNext();
        });      
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._stateStr.length == 0){
            return;
        }
        this.tips.string = this._stateStr + ' ';
        if(this._isLoading){
            this.tips.string += Math.floor(this._progress * 100) + "%";   
        }
        else{
            var t = Math.floor(Date.now() / 1000) % 4;
            for(var i = 0; i < t; ++ i){
                this.tips.string += '.';
            }            
        }
    }
});
