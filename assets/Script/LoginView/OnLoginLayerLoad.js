// OnLoginLayerLoad.js
var msgcode = require( 'Msgcode' )
var packet = require( 'Lpackage' )

cc.Class({
    extends: cc.Component,
    
    properties: {
        prefabNormalRegister:{
            default: null,
            type: cc.Prefab,
        },

        prefabPhoneRegister : cc.Prefab,

        accountBox : {
        	default : null,
        	type: cc.EditBox,
        },

        passwordBox : {
        	default : null,
        	type: cc.EditBox,
        },

        rememberCheckBox : cc.Toggle,
        
        _login_type : 0,
    },
    onLoad:function() {
    	var account = cc.sys.localStorage.getItem('account');
    	var password = cc.sys.localStorage.getItem('password');
    	if (account != null && account != ""){
    		this.accountBox.string = account;
    		this.passwordBox.string = password;
    	}
    },
    onNormalRegisterClick:function(){
        var instance = this.prefabNormalRegister;
        if( this._login_type == 2 ){
            // 手机登陆注册
            instance = this.prefabPhoneRegister;
        }
        var bg = cc.find("Canvas/BgLayer");
        let registerlayer = cc.instantiate(instance);  
        registerlayer.parent = bg;
        registerlayer.setPosition(0,0);
        cc.ll.sAudioMgr.playNormalBtnClick();
    },

    onDistroy:function(){
    	this.node.destroy();
        cc.ll.sAudioMgr.playNormalBtnClick();
    },

    onLoginClick: function() {
    	var account = this.accountBox.string;
    	var password = this.passwordBox.string;
    	if (account.length > 12 || account.length < 6){
    		cc.ll.msgbox.addMsg(msgcode.ACCOUNT_TOO_LONG);
    		return;
    	}
    	if (this.rememberCheckBox.isChecked) {
    		cc.sys.localStorage.setItem('account', account);
    		cc.sys.localStorage.setItem('password', password);
    	}
    	var p = new packet( "Reqlogin" );
        p.lpack.account = account;
        p.lpack.password = password;
        cc.ll.net.send( p.pack() );

        cc.ll.loading.addLoading(5);
        cc.ll.sAudioMgr.playNormalBtnClick();
    },
});