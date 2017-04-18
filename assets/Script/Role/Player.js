var p = cc.Class({
	properties: {
		name : "",
		id : 0,
		state : 0,// 0未登陆， >0 已登录  1 在大厅 2 在房间 3 在游戏中
		room : 0,
		gold : 0,
		gmlevel:0,
		_list : null,
		_firstChoose : null,
	},

	ctor : function(){
		this._firstChoose = new cc.Event.EventCustom("GoldChange", false);
		this._list = {};
	},

	login : function( obj ){
		this.name = obj.name;
		this.id = obj.id;
		this.gold = obj.gold;
		this.state = 1;
		this.room = 0;
		this.gmlevel = obj.gm;
		
		cc.ll.pMgr.main_role = this;
        cc.ll.sSceneMgr.onChangeScene("mainview");
	},

	register : function( event, node, func ) {
		if( this._list[event] == null ){
			this._list[event] = [];
		}
		this._list[event][this._list[event].length] = node;
		node.on(event, func)
	},

	onGoldChanged : function( gold ){
		this.gold = gold;
		this._firstChoose.setUserData(this.gold);
		if(this._list["GoldChange"] != null && this._list["GoldChange"].length > 0){
			var nodelist = this._list["GoldChange"];
			for (var i = 0; i < nodelist.length; i++) {
				var node = nodelist[i];
				if (node) {
					node.dispatchEvent(this._firstChoose) 
				}
			}
		}
	}
});

module.exports = p;