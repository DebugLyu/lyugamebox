"use strict";
cc._RFpush(module, 'f0992R5jEtKd7NN7EJvWM0I', 'PreBankerItem');
// Script/GameView/PreBankerItem.js

cc.Class({
    "extends": cc.Component,

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
        _PlayerName: null,
        _ID: 0,
        _Type: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onChangeName: function onChangeName(id, name, type) {
        this._ID = id;
        this._PlayerName = name;
        this._Type = type;
        var label = this.getComponent(cc.Label);
        label.string = name;
        if (type == 1) {
            this.node.color = new cc.Color(255, 255, 255);
        } else if (type == 2) {
            this.node.color = new cc.Color(255, 165, 0);
        }
    }
});

cc._RFpop();