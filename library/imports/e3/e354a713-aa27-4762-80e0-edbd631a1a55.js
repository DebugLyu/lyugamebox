'use strict';

var packet = require('Lpackage');
var msgbox = require('Msgbox');
var msgcode = require('Msgcode');
var common = require('Common');

cc.Class({
    extends: cc.Component,

    properties: {
        accountBox: {
            default: null,
            type: cc.EditBox
        },

        passwordBox: {
            default: null,
            type: cc.EditBox
        },

        passwordBox2: {
            default: null,
            type: cc.EditBox
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onRegisterClick: function onRegisterClick() {
        var account = this.accountBox.string;
        var passowrd = this.passwordBox.string;
        var passowrd2 = this.passwordBox2.string;

        if (account.length > 12 || account.length < 6 || passowrd.length > 12 || passowrd.length < 6) {
            cc.ll.msgbox.addMsg(msgcode.ACCOUNT_TOO_LONG);
            return;
        }
        if (passowrd != passowrd2) {
            cc.ll.msgbox.addMsg(msgcode.PASSWORD_NOT_SAME);
            return;
        }
        var p = new packet("ReqRegister");
        p.lpack.account = account;
        p.lpack.password = passowrd;
        cc.ll.net.send(p.pack());
        cc.sys.localStorage.setItem('account', account);
        cc.sys.localStorage.setItem('password', password);
    },
    onDistroy: function onDistroy() {
        this.node.destroy();
    }
});