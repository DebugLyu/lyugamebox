//AudioManager.js
var AMgr = cc.Class({
	properties: {
		_sound_size : 0.5,
		_current : 0,
		_curbgm : "",
	},
	statics:{
		init : function(){
			var size = cc.sys.localStorage.getItem('soundSize');
			if( size == null ){
				size = 1;
				cc.sys.localStorage.setItem('soundSize', 1);
			}
			size = Number(size);
			this._sound_size = size;

			cc.game.on(cc.game.EVENT_HIDE, function () {
			    console.log("cc.audioEngine.pauseAll");
			    cc.audioEngine.pauseAll();
			});
			cc.game.on(cc.game.EVENT_SHOW, function () {
			    console.log("cc.audioEngine.resumeAll");
			    cc.audioEngine.resumeAll();
			});
		},
		getUrl:function(url){
	        return cc.url.raw("resources/sound/" + url + ".mp3");
	    },

		playBGM : function( url ){
			this._curbgm = url;
			if(this._sound_size <= 0){
				return;
			}
			var audioUrl = this.getUrl(url);
			console.log(audioUrl);
	        if(this._current >= 0){
	            cc.audioEngine.stop(this._current);
	        }
			this._current = cc.audioEngine.play( audioUrl, true, this._sound_size);
		},
		stopBGM : function(){
			cc.audioEngine.stop( this._current );
		},
		pauseBGM:function(){
			cc.audioEngine.pause(this._current);
		},
		resumeBGM: function() {
			cc.audioEngine.resume(this._current);
		},

		setSize : function( size ){
			if( size < 0 || size > 1 ){
				return;
			}
			if( this._sound_size == size ){
				return;
			}

			this._sound_size = size;
			cc.sys.localStorage.setItem('soundSize', this._sound_size);
			if (size == 0) {
				cc.audioEngine.pause(this._current);
			}else{
				if( Number(this._current) == 0 ){
					if( this._curbgm != "" ){
						this.playBGM( this._curbgm );
					}
				}else{
					cc.audioEngine.resume(this._current);
				}
			}			
		},
		getSize : function(){
			return this._sound_size;
		},

		play : function( url ){
			if(this._sound_size <= 0){
				return;
			}
			var audioUrl = this.getUrl(url);
			cc.audioEngine.play( audioUrl, false, this._sound_size);
			// cc.audioEngine.playEffect(audioUrl, false, 1)
		},

		playNormalBtnClick : function(){
			this.play("btnClick");
		},
	},
});

module.exports = AMgr;