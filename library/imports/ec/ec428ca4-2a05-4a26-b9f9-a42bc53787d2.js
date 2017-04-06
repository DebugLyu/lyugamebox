var pMgr = require("PlayerManager").getInstance();
var sSceneMgr = require("SceneManager");

var p = function p() {
	this.name = "";
	this.id = 0;
	this.state = 0; // 0未登陆， >0 已登录  1 在大厅 2 在房间 3 在游戏中
	this.room = 0;
	this.gold = 0;

	this.login = function (obj) {
		this.name = obj.name;
		this.id = obj.id;
		this.gold = obj.gold;
		this.state = 1;
		this.room = 0;

		pMgr.main_role = this;
		sSceneMgr.onChangeScene("mainview");
	};

	var list = {};
	this.register = function (event, node, func) {
		if (list[event] == null) {
			list[event] = [];
		}
		list[event][list[event].length] = node;
		node.on(event, func);
	};

	var firstChoose = new cc.Event.EventCustom("GoldChange", false);
	this.onGoldChanged = function (gold) {
		this.gold = gold;
		firstChoose.setUserData(this.gold);
		if (list["GoldChange"] != null && list["GoldChange"].length > 0) {
			var nodelist = list["GoldChange"];
			for (var i = 0; i < nodelist.length; i++) {
				var node = nodelist[i];
				if (node) {
					node.dispatchEvent(firstChoose);
				}
			}
		}
	};
};

module.exports = p;