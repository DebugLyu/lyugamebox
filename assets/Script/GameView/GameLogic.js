var pMgr = require("PlayerManager").getInstance()
var packet = require( 'Lpackage' )
var ErrorCode = require("errorcode")
var msgcode = require( 'Msgcode' )
var TuiBingConfig = require("TuiBingConfig")

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        perBankerList : cc.ScrollView,
        itemPreforb : cc.Prefab,
        goldPrefab : cc.Prefab,

        goldBtnLsit: [cc.Button],

        bankerNameLabel : cc.Label,
        bankerGoldLabel : cc.Label,
        bankerTimesLabel : cc.Label,
        betPoolLabel : cc.Label,

        maJiangList:[cc.Node],
        bgList:[cc.Node],

        btnBeBanker : cc.Button,
        btnUnBanker : cc.Button,

        dice : cc.Node,
        // 游戏属性
        _banker_id : 0,
        _banker_name : "暂无庄家",
        _game_state : 0,
        _banker_times : 0,
        _banker_gold : 0,

        _south_pool : new Array(),
        _sky_pool : new Array(),
        _north_pool : new Array(),

        _select_gold : 0,
        _can_bet_gold : 0, 
        _be_banker_list : [Object],

        MajiangSpriteList : cc.SpriteAtlas,
    },

    // use this for initialization
    onLoad: function () {
        this._select_gold = 0;
        var obj = {playerid: 0, gold : 0};
        this._south_pool.push( obj );

        var btn = this.goldBtnLsit[0];
        if( btn != null ){
            var button = btn.getComponent(cc.Button);
            var select_gold = parseInt(btn.node.name) * 1000;
            var max = pMgr.main_role.gold;
            if( select_gold <= max){
                button.interactable = false;
                this._select_gold = select_gold;
            }
        }

        var p = new packet( "ReqTuiBingInfo" );
        cc.ll.net.send( p.pack() );        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    reSetGame: function() {
        for (var i = 0; i < this.bgList.length; i++) {
            var bg = this.bgList[i];
            bg.removeAllChildren();
        }
        var obj = {majiang1:"bg", majiang2:"bg"};
        for (var i = 0; i < this.maJiangList.length; i++) {
            var majiangnode = this.maJiangList[i];
            this.OpenMajiang( majiangnode, obj )
            var pointbg = majiangnode.getChildByName( "PointBg" );
            pointbg.active = false;
        }
        this.betPoolLabel.string = 0;
        this.dice.active = false;
    },

    initBanker: function () {
        this._banker_id = 0;
        this._banker_name = 0;
        this.bankerNameLabel.string = msgcode.TUIBING_STATE_STOP;
        this.bankerGoldLabel.string = 0;
        this.bankerTimesLabel.string = 0;
        this.betPoolLabel.string = 0;

        this.btnBeBanker.node.active = true;
        this.btnUnBanker.node.active = false;
    },

    onQueueChanged: function( banker, list ) {
        if ( banker.bankerid != 0 ){
            this._banker_id = banker.bankerid;
            this._banker_name = banker.bankername;
            this.bankerNameLabel.string = this._banker_name;
        }

        var node = cc.find("Canvas/GameBgLayer/BankerList/view/content");
        node.removeAllChildren()

        // console.log("id = " + id + ";name = "+ name);

        for (var i = 0; i < list.length; i++) {
            var info = list[i]
            var item = cc.instantiate(this.itemPreforb);
            var sprite = item.getComponent("PreBankerItem");
            sprite.onChangeName( info.playerid, info.playername, info.type );
            item.x = 0;
            item.y = - i * 40;
            node.addChild( item )
        }
        node.height = list.length * 40;
        this._be_banker_list = list;
    },

    onGameStateChange: function(state) {
        this._game_state = state;
        for (var i = 0; i < this.maJiangList.length; i++) {
            var majiangnode = this.maJiangList[i];
            majiangnode.active = ( state == 6 || state == 7 );
        }
        if(state == 5){
            this.reSetGame();
        }
        switch(state){
            case TuiBingConfig.State.Stop:{
                this.initBanker();
                cc.ll.msgbox.addMsg(msgcode.TUIBING_STATE_STOP);
            }break;
            case TuiBingConfig.State.Begin:{
            };
            case TuiBingConfig.State.Begin_Check_Begin:{
            };
            case TuiBingConfig.State.Begin_Check_Keep:{
                cc.ll.msgbox.addMsg(msgcode.TUIBING_STATE_BEGIN);
            }break;
            case TuiBingConfig.State.WaitOpen:{
                cc.ll.msgbox.addMsg(msgcode.TUIBING_STATE_WAITOPEN);
            }break;
            case TuiBingConfig.State.Openning:{
                cc.ll.msgbox.addMsg(msgcode.TUIBING_STATE_OPENNING);
            }break;
            case TuiBingConfig.State.Reward:{
                cc.ll.msgbox.addMsg(msgcode.TUIBING_STATE_REWARD);
            }break;
        }
    },

    onGoldAction : function ( id, pos, gold ){
        var bgstr = "";
        if (pos == 1) {
            bgstr = "Canvas/GameBgLayer/GameBg/SouthBg";
        }else if (pos == 2) {
            bgstr = "Canvas/GameBgLayer/GameBg/SkyBg";
        }else if (pos == 3) {
            bgstr  = "Canvas/GameBgLayer/GameBg/NorthBg";
        }
        if (bgstr.length <= 5){
            return;
        }
        var num = 0;
        if ( gold < 10000 ){
            num = 1;
        }else if (gold >= 10000 && gold < 100000) {
            num = 2;
        }else if (gold >= 100000 ) {
            num = 3;
        }

        var node = cc.find( bgstr );
        for (var i = 0; i < num; i++) {
            var x = Math.round(Math.random()*node.width) - node.width / 2;
            x = x>0?x-30:x+30;
            var y = Math.round(Math.random()*node.height) - node.height / 2;
            y = y>0?y-30:y+30;
            var gold = cc.instantiate(this.goldPrefab);
            gold.x = x;
            gold.y = y;
            node.addChild( gold );
        }
    },

    onAutoSelectGold: function(){
        var max = pMgr.main_role.gold;
        this._select_gold = 0;
        for (var i = this.goldBtnLsit.length - 1; i >= 0; i--) {
            var btn = this.goldBtnLsit[i];
            var button = btn.getComponent(cc.Button);
            var select_gold = parseInt(btn.node.name) * 1000;
            if( select_gold <= this._can_bet_gold ){
                if( select_gold > max ){
                    button.interactable = true;
                }else{
                    button.interactable = false;
                    this._select_gold = select_gold;
                }
            }
        }
    },

    onBetGold : function( event, pos ){
        if ( this._game_state != 5 ){
            return;
        }
        var maxgold = pMgr.main_role.gold;
        if (maxgold < 1000){
            cc.ll.msgbox.addMsg(msgcode.GOLD_NOT_ENOUGH);
            return;
        }
        
        if (this._select_gold ==0) {
            cc.ll.msgbox.addMsg(msgcode.TUIBING_SELECT_GOLD);
            return;
        }

        if( this._select_gold > maxgold ){
            this.onAutoSelectGold();
        }

        if( this._select_gold > this._can_bet_gold ){
            cc.ll.msgbox.addMsg(msgcode.TUIBING_MORETHAN_BANKER);
            return;
        }
        
        var p = new packet( "ReqTuiBingBet" );
        p.lpack.pos = parseInt(pos);
        p.lpack.gold = this._select_gold;
        cc.ll.net.send( p.pack() );
    },

    onSelectGold: function( event, gold ){
        var max = pMgr.main_role.gold;
        var select_gold = parseInt(gold);
        if (select_gold > max) {
            return;
        }
        if ( select_gold > this._can_bet_gold ){
            return;
        }
        var node = event.target;
        for (var i = 0; i < this.goldBtnLsit.length; i++) {
            var btn = this.goldBtnLsit[i];
            var button = btn.getComponent(cc.Button);
            button.interactable = btn.node.name != node.name;
        }
        this._select_gold = select_gold;
    },

    onBetGoldCount: function( gold ){
        this.betPoolLabel.string = gold;
        this._can_bet_gold = this._banker_gold - gold;
    },

    OpenMajiang: function( node, obj ){
        var self = this;
        var changesprite = function( sprite_node, sprite_name ){
            var sprite = sprite_node.getComponent( cc.Sprite );
            var frame = self.MajiangSpriteList.getSpriteFrame( sprite_name );
            sprite.spriteFrame = frame;
        }
        var majiang1 = node.getChildByName( "Majiang1" );
        var majiang2 = node.getChildByName( "Majiang2" );
        var pointbg = node.getChildByName( "PointBg" );
        pointbg.active = true;
        var namespr = "img_majiang_" + obj.majiang1
        changesprite(majiang1, namespr)
        namespr = "img_majiang_" + obj.majiang2
        changesprite(majiang2, namespr)
        if (obj.majiang1 == "bg"){
            return
        }
        var numspr = pointbg.getChildByName( "NumSpr" );
        
        if ( obj.majiang1 == obj.majiang2 ){
            namespr = "img_double_num";
        }else{
            var num = (obj.majiang1+obj.majiang2)%10;
            namespr = "img_"+ num +"point_num";
        }
        changesprite(numspr, namespr);
    },

    // majiangs 0 庄 1 南 2 天 3 北 {majiang1 majiang2}
    onOpenMajiang: function( majiangs ){
        // 先撒骰子
        var random_1 = Math.ceil(Math.random()*5 + 1);
        var random_2 = Math.ceil(Math.random()*5 + 1);

        this.dice.active = true;
        var action = this.dice.getComponent( cc.Animation )
        action.play();
        var majianglist = this.maJiangList

        var self = this;
        var dice1 = cc.find( "/Canvas/GameBgLayer/Dice1" )
        var dice2 = cc.find( "/Canvas/GameBgLayer/Dice2" )
        var key = (random_1+random_2)%4;
        var list = [ key,(key+1)%4,(key+2)%4,(key+3)%4];
        var stopact = function(){
            action.stop();
            self.dice.active = false;
            var showdice = function(sprite_node, sprite_name){
                var sprite = sprite_node.getComponent( cc.Sprite );
                var frame = self.MajiangSpriteList.getSpriteFrame( sprite_name );
                sprite.spriteFrame = frame;
                sprite_node.active = true;
            }
            showdice( dice1, "img_dice_" + random_1 );
            showdice( dice2, "img_dice_" + random_2 );
        }
        var hidedice = function(){
            dice1.active = false;
            dice2.active = false;
        }
        var open = function( id ) {
            var node = majianglist[ id ];
            var nums = majiangs[ id ];
            self.OpenMajiang( node, nums );
        }
        var open1 = function(){open(list[0]);}
        var open2 = function(){open(list[1]);}
        var open3 = function(){open(list[2]);}
        var open4 = function(){open(list[3]);}

        var queue = [];
        queue.push( cc.delayTime(1.5) );
        queue.push( cc.callFunc( stopact ) );
        queue.push( cc.delayTime(1) );
        queue.push( cc.callFunc( hidedice ) );
        queue.push( cc.callFunc( open1 ) );
        queue.push( cc.delayTime( 0.5  ) );
        queue.push( cc.callFunc( open2 ) );
        queue.push( cc.delayTime( 0.5  ) );
        queue.push( cc.callFunc( open3 ) );
        queue.push( cc.delayTime( 0.5  ) );
        queue.push( cc.callFunc( open4 ) );
        var act = cc.sequence(queue);
        this.node.runAction(act);
    },

    onBankerInfo: function( obj ) {
        if ( obj.id == 0 ){
            this.initBanker();
            return;
        }
        this._banker_id = obj.id;
        this._banker_name = obj.name;
        this._banker_times = obj.times;
        this._banker_gold = obj.gold;
        this.bankerNameLabel.string = obj.name;
        this.bankerGoldLabel.string = obj.gold;
        this.bankerTimesLabel.string = obj.times;
        if ( pMgr.main_role.id == this._banker_id ){
            this.btnBeBanker.node.active = false;
            this.btnUnBanker.node.active = true;
        }else{
            this.btnBeBanker.node.active = true;
            this.btnUnBanker.node.active = false;
        }
        this._can_bet_gold = this._banker_gold
    },

    canBeBanker : function(){
        if ( pMgr.main_role.id == this._banker_id ){
            return ErrorCode.UR_BANKER;
        }
        for (var i = 0; i < this._be_banker_list.length; i++) {
            var info = this._be_banker_list[i]
            if( pMgr.main_role.id == info.playerid ){
                return ErrorCode.HAS_IN_QUEUE
            }
        }
        return 0;
    }
});
