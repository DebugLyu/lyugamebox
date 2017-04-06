"use strict";
cc._RFpush(module, '581225Not5E7Im019XdMY0L', 'OnGameViewLoad');
// Script/GameView/OnGameViewLoad.js

'use strict';

var common = require('Common');
var pMgr = require("PlayerManager").getInstance();
var msgbox = require('Msgbox');
var packet = require('Lpackage');
var sSceneMgr = require("SceneManager");

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
            type: cc.Label
        },
        GoldLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (pMgr.main_role !== null) {
            this.NameLabel.string = pMgr.main_role.name;
            this.GoldLabel.string = pMgr.main_role.gold;
        }

        var node = this.GoldLabel.node;
        pMgr.main_role.register("GoldChange", node, function (event) {
            var gold = event.getUserData();
            var label = node.getComponent(cc.Label);
            label.string = gold;
        });
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onBackClicked: function onBackClicked() {
        var p = new packet("ReqLeaveRoom");
        common.send(p.pack());

        sSceneMgr.onChangeScene("mainview");
    },

    onBeBankerClicked: function onBeBankerClicked() {
        var p = new packet("ReqBeBanker");
        p.lpack.type = 1;
        common.send(p.pack());
    },

    onFastBeBankerClicked: function onFastBeBankerClicked() {
        var p = new packet("ReqBeBanker");
        p.lpack.type = 2;
        common.send(p.pack());
    },

    onAddGoldBtnClicked: function onAddGoldBtnClicked() {
        var p = new packet("ReqAddGold");
        p.lpack.gold = 100000;
        common.send(p.pack());
    },

    onUnBankerBtnClick: function onUnBankerBtnClick() {
        var p = new packet("ReqTuiBingUnbanker");
        common.send(p.pack());
    },

    onLeaveQueueBtnClick: function onLeaveQueueBtnClick() {
        var p = new packet("ReqTuibingLeaveQueue");
        common.send(p.pack());
    }
});

cc._RFpop();