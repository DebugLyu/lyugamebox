//SettingView.js
var setting = cc.Class({
	properties: {
		pfab : null,
	},
	statics:{
		showSetting : function(){
			var node = cc.instantiate(this.pfab);
			cc.director.getScene().addChild(node);
		},
		init : function(){
			var self = this;
			cc.loader.loadRes("profab/SettingLayer", function (err, prefab) {
			    self.pfab = prefab;
			});
		},
	},
});

module.exports = setting;