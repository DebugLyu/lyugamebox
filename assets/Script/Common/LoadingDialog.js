var LOADING_DIALOG_TAG = 909876;

var Loading = cc.Class({
	statics:{
		pfab : null,
		isInit : false,
		init : function(){
			var self = this;
            cc.loader.loadRes("profab/LoadingLayer", function (err, prefab) {
                self.pfab = prefab;
                self.isInit = true;
            });
		},

		addLoading : function( t ){
			if( this.isInit ){
				var node = cc.instantiate(this.pfab);
				var act = node.getComponent( cc.Animation )
				act.play()
				cc.director.getScene().addChild(node, 999, LOADING_DIALOG_TAG);
				if (t == null) {
					t = 10;
				}
				var self = this;
				setTimeout(function(){self.removeLoading();}, t*1000)
			}
		},
		removeLoading : function(){
			var node = cc.director.getScene().getChildByTag(LOADING_DIALOG_TAG);
			if( node != null ){
				cc.director.getScene().removeChildByTag( LOADING_DIALOG_TAG );
			}
		},
	},
});

module.exports = Loading;