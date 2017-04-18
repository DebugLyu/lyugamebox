//SettingViewLoad.js
cc.Class({
    extends: cc.Component,

    properties: {
    	_clicked : false,
    	bar : cc.ProgressBar,
    	btnSound : cc.Button,
    	SpriteList : cc.SpriteAtlas,
    },

    onLoad:function(){
    	var size = cc.sys.localStorage.getItem('soundSize');
    	if(size > 0){
    		this._clicked = false;
    	}else{
    		this._clicked = true;
    	}
    	this.onAudioClick( null, this._clicked );
    },

    onAudioSetting : function( slider, customEventData ){
    	var size = slider.progress;
    	this.bar.progress = size;
    	cc.ll.sAudioMgr.setSize( size );
    },

    onAudioClick : function( e, force ){
    	if( force != null ){
    		this._clicked = force;
    	}else{
    		this._clicked = !this._clicked;
    	}

    	if( this._clicked ){
    		this.btnSound.normalSprite = this.SpriteList.getSpriteFrame( "btn_sound_2" );
    		cc.ll.sAudioMgr.setSize( 0 );
    		
    	}else{
    		this.btnSound.normalSprite = this.SpriteList.getSpriteFrame( "btn_sound_1" );
    		cc.ll.sAudioMgr.setSize( 1 );
    	}
    },

    onDistroy:function(){
        this.node.destroy();
    },
});