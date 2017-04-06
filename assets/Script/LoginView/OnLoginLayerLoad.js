// OnLoginLayerLoad.js
var common = require('Common')
var msgbox = require('Msgbox')
var msgcode = require( 'Msgcode' )
var packet = require( 'Lpackage' )

cc.Class({
    extends: cc.Component,
    
    properties: {
        prefabNormalRegister:{
            default: null,
            type: cc.Prefab,
        },

        accountBox : {
        	default : null,
        	type: cc.EditBox,
        },

        passwordBox : {
        	default : null,
        	type: cc.EditBox,
        },

        rememberCheckBox : cc.Toggle,
        
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
        var bg = cc.find("BgLayer");
        let registerlayer = cc.instantiate(this.prefabNormalRegister);  
        registerlayer.parent = bg;
        registerlayer.setPosition(0,0);
    },

    onDistroy:function(){
    	this.node.destroy();
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
    },
});