"use strict";
cc._RFpush(module, '4b516Dz5y1FmJdkdLzUSFjn', 'OnLoginViewLoad');
// Script/LoginView/OnLoginViewLoad.js

"use strict";

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
    },

    // use this for initialization
    onLoad: function onLoad() {},

    ontest: function ontest() {
        var callback = function callback() {
            console.log("aaaaaaaaaaaaaaaaaaa");
        };
        notice.getInstance().addMsg(2, "继续11游戏么？", callback);
    }
});

cc._RFpop();