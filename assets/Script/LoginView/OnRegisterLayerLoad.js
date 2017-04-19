var packet = require( 'Lpackage' );
var msgcode = require( 'Msgcode' )

cc.Class({
    extends: cc.Component,

    properties: {
        accountBox : {
            default : null,
            type: cc.EditBox,
        },

        passwordBox : {
            default : null,
            type: cc.EditBox,
        },

        passwordBox2 : {
            default : null,
            type: cc.EditBox,
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onRegisterClick: function () {
        var account = this.accountBox.string;
        var password = this.passwordBox.string;
        var password2 = this.passwordBox2.string;

        if (account.length > 12 || account.length < 6 ||
            password.length > 12 || password.length < 6 ) {
            cc.ll.msgbox.addMsg(msgcode.ACCOUNT_TOO_LONG);
            return;
        }
        if (password != password2) {
            cc.ll.msgbox.addMsg(msgcode.PASSWORD_NOT_SAME);
            return;
        }
        var p = new packet( "ReqRegister" );
        p.lpack.account = account;
        p.lpack.password = password;
        cc.ll.net.send( p.pack() );
        cc.sys.localStorage.setItem('account', account);
        cc.sys.localStorage.setItem('password', password);
        cc.ll.sAudioMgr.playNormalBtnClick();
    },

    onDistroy:function(){
        this.node.destroy();
        cc.ll.sAudioMgr.playNormalBtnClick();
    },
});
