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
        _nameList : [""],
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        cc.game.config['myversion']= etc.version;
        cc.game.config['noCache']=true;
        // this.loadingBar.totalLength = this.loadingBar.node.width;

        cc.ll = {};
        this.tips.string = "正在初始化...";
        // 初始化网络
        cc.ll.net = require("Lwebsocket");
        cc.ll.net.init();
        // 初始化协议
        cc.loader.loadRes("gamebox", function (err, arr){
            cc.ll.pb = ProtoBuf.protoFromString(arr); 
        });
        //初始化通用界面
        cc.ll.msgbox = require("Msgbox");
        cc.ll.notice = require("Notice");
        cc.ll.notice.init();
        //初始化loading界面
        cc.ll.loading = require("LoadingDialog");
        cc.ll.loading.init();
        //初始化 玩家管理器
        cc.ll.pMgr = require("PlayerManager");
        cc.ll.pMgr.init();
        //初始化 场景管理器
        cc.ll.sSceneMgr = require("SceneManager");
        //初始化 音效管理器
        cc.ll.sAudioMgr = require("AudioManager");
        cc.ll.sAudioMgr.init();
        
        // 加载资源
        this._loadingList = ["erguotou","login","main","profab","res_common","sound"];
        this._nameList = ["必要","重要","游戏","界面","UI","通用","其他"];
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
            var name = this._nameList[ this._loadkey ];
            var dir = this._loadingList[ this._loadkey ];
            this.startPreloading( name, dir );
        }
        this._loadkey = this._loadkey + 1;
    },

    startPreloading:function(name , dir){
        this._stateStr = "正在加载"+name+"资源，请稍候";
        this._isLoading = true;
        var self = this;
        
        cc.loader.onProgress = function ( completedCount, totalCount,  item ){
            // console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
            if(self._isLoading){
                self._progress = completedCount/totalCount;
                self.loadingBar.progress = self._progress;
            }
        };
        
        cc.loader.loadResDir(dir, function (err, assets) {
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
