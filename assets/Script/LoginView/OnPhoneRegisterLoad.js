var packet = require( 'Lpackage' );
var msgcode = require( 'Msgcode' )

cc.Class({
    extends: cc.Component,

    properties: {
        accountBox : {
            default : null,
            type: cc.EditBox,
        },

        CheckBox : {
            default : null,
            type: cc.EditBox,
        },

        passwordBox : {
            default : null,
            type: cc.EditBox,
        },

        CheckBtn : cc.Button,
        CheckLabel : cc.Label, 
    },

    // use this for initialization
    onLoad: function () {
        if(cc.ll.phone_check_time == 0 || cc.ll.phone_check_time == null){
            return;
        }
        var timestamp = new Date().getTime();
        var lefttime = Math.ceil( timestamp / 1000 ) - cc.ll.phone_check_time;
        if ( lefttime < 30){
            this.showTimer( lefttime );
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    isNumber: function(value) {
        var patrn = /^(-)?\d+(\.\d+)?$/;
        if (patrn.exec(value) == null || value == "") {
            return false
        } else {
            return true
        }
    },
    onRegisterClick: function () {
        var account = this.accountBox.string;
        var checknum = this.CheckBox.string;
        var password = this.passwordBox.string;

        if (account.length != 11 ) {
            cc.ll.msgbox.addMsg(msgcode.ACCOUNT_PHONE_ERROR);
            return;
        }
        if( ! this.isNumber( account ) ){
            cc.ll.msgbox.addMsg(msgcode.ACCOUNT_PHONE_ERROR);
            return;
        }
        if (checknum.length != 6) {
            cc.ll.msgbox.addMsg(msgcode.PASSWORD_NOT_SAME);
            return;
        }
        var p = new packet( "ReqRegisterPhone" );
        p.lpack.phonenum = account;
        p.lpack.password = password;
        p.lpack.checknum = checknum;
        cc.ll.net.send( p.pack() );

        cc.sys.localStorage.setItem('account', account);
        cc.sys.localStorage.setItem('password', password);
        cc.ll.sAudioMgr.playNormalBtnClick();
    },
    showTimer : function( time ) {
        var time = time || 30;
        this.CheckBtn.node.active = false;
        this.CheckLabel.node.active = true;
        this.schedule(function() {
            this.CheckLabel.string = time + " s";
            time -- ;
            if( time == 0 ){
                this.CheckBtn.node.active = true;
                this.CheckLabel.node.active = false;
            }
        }, 1, time, 0)
    },
    onCheckBtnClicked : function() {
        var account = this.accountBox.string;
        if (account.length != 11) {
            cc.ll.msgbox.addMsg(msgcode.ACCOUNT_PHONE_ERROR);
            return;
        }
        
        if( ! this.isNumber( account ) ){
            cc.ll.msgbox.addMsg(msgcode.ACCOUNT_PHONE_ERROR);
            return;
        }
        var p = new packet( "ReqSendCheck" );
        p.lpack.phonenum = account;
        cc.ll.net.send( p.pack() );
        this.showTimer();
        var timestamp = new Date().getTime();
        cc.ll.phone_check_time = Math.ceil( timestamp / 1000 );
    },

    onDistroy:function(){
        this.node.destroy();
        cc.ll.sAudioMgr.playNormalBtnClick();
    },
});
