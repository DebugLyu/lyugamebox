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

        noticeLabel : cc.Label, 
        betPoolLabel : [cc.Label],

        maJiangList:[cc.Node],
        bgList:[cc.Node],

        btnBeBanker : cc.Button,
        btnUnBanker : cc.Button,

        dice : cc.Node,
        // game params
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

        _mj_move_key : 1,
        _mj_old_pos : [cc.Vec2],

        _timer : 0,
        MajiangSpriteList : cc.SpriteAtlas,

        _gmPrefab : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this._select_gold = 0;
        var obj = {playerid: 0, gold : 0};
        this._south_pool.push( obj );

        var btn = this.goldBtnLsit[0];
        if( btn != null ){
            var button = btn.getComponent(cc.Button);
            var select_gold = parseInt(btn.node.name) * TuiBingConfig.LessGold;
            var max = cc.ll.pMgr.main_role.gold;
            if( select_gold <= max){
                button.interactable = false;
                this._select_gold = select_gold;
            }
        }
        for (var i = 1; i <= 4; i++) {
            var node = cc.find( "Canvas/GameBgLayer/MJList/group" + i);
            this._mj_old_pos[i-1] = node.getPosition();
        }
        this.reSetGame();
        setTimeout( function(){
            var p = new packet( "ReqTuiBingInfo" );
            cc.ll.net.send( p.pack() ); 
        }, 500 );

        var node = cc.find( "Canvas/GameBgLayer/TopBg/TimerBg/Timer" )
        var timer_label = node.getComponent( cc.Label );
        var self = this;
        setInterval(function(){
            if(self._timer > 0){
                var str = ""
                if(self._timer >= 10){
                    str = self._timer.toString();
                }else{
                    str = "0" + self._timer.toString();
                }
                timer_label.string = "00:"+str;
                self._timer --;
            }else{
                timer_label.string = "00:00";
            }
        },1000);

        cc.game.on(cc.game.EVENT_HIDE, function () {
            
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("game.reSetGame");
            var scenename = cc.director.getScene().name;
            if( scenename != "tuibingview" ){
                return;
            }
            self.reSetGame();
        });

        var node = cc.find("Canvas/GameBgLayer/GMLayer");
        if(cc.ll.pMgr.main_role.gmlevel > 0){
            cc.loader.loadRes("profab/GMLayer", function (err, prefab) {
                self._gmPrefab = prefab;
            });
            node.active = true;
        }else{
            node.active = false;
        }
    },

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
        for (var i = this.betPoolLabel.length - 1; i >= 0; i--) {
            var label = this.betPoolLabel[i]
            label.string = 0;
        }
        this.dice.active = false;
        for (var i = 0; i < this.maJiangList.length; i++) {
            var majiangnode = this.maJiangList[i];
            majiangnode.active = false;
        }
        for (var i = 1; i <= 4; i++) {
            var node = cc.find( "Canvas/GameBgLayer/MJList/group" + i);
            node.setPosition( this._mj_old_pos[i-1] );
            node.active = true;
            node.stopAllActions();
        }
        this.node.stopAllActions();
        this._mj_move_key = 1;
    },

    initBanker: function () {
        this._banker_id = 0;
        this._banker_name = 0;
        this.bankerNameLabel.string = msgcode.TUIBING_NO_BANKER;
        this.bankerGoldLabel.string = 0;
        this.bankerTimesLabel.string = 0;

        for (var i = this.betPoolLabel.length - 1; i >= 0; i--) {
            var label = this.betPoolLabel[i]
            label.string = 0;
        }

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
        var find = false;
        for (var i = 0; i < list.length; i++) {
            var info = list[i]
            var item = cc.instantiate(this.itemPreforb);
            var sprite = item.getComponent("PreBankerItem");
            sprite.onChangeName( 1, info.playerid, info.playername, info.type );
            item.x = 0;
            item.y = - i * 40;
            node.addChild( item )
            if( info.playerid == cc.ll.pMgr.main_role.id ){
                find = true;
            }
        }

        node.height = list.length * 40;

        var leavebtn = cc.find("Canvas/GameBgLayer/LeaveQueueBtn");
        leavebtn.active = find;
        this._be_banker_list = list;
    },

    onGameStateChange: function(state) {
        this._game_state = state;
        
        switch(state){
            case TuiBingConfig.State.Stop:{
                this.reSetGame();
                this.initBanker();
                // cc.ll.msgbox.addMsg(msgcode.TUIBING_STATE_STOP);
                this.noticeLabel.string = msgcode.TUIBING_STATE_STOP;
                this._timer = 0;
            }break;
            case TuiBingConfig.State.Begin:{
            };
            case TuiBingConfig.State.Begin_Check_Begin:{
                this.reSetGame();
                this._timer = TuiBingConfig.Time.Begin;
                this.noticeLabel.string = msgcode.TUIBING_STATE_BEGIN;
            }break;
            case TuiBingConfig.State.Begin_Check_Keep:{
                // cc.ll.msgbox.addMsg(msgcode.TUIBING_STATE_BEGIN);
                this.noticeLabel.string = msgcode.TUIBING_STATE_BEGIN;
                this._timer = TuiBingConfig.Time.Begin_keep;
            }break;
            case TuiBingConfig.State.Ready:{
                this.noticeLabel.string = msgcode.TUIBING_STATE_READY;
                this._timer = TuiBingConfig.Time.Bet;
            }break;
            case TuiBingConfig.State.WaitOpen:{
                // cc.ll.msgbox.addMsg(msgcode.TUIBING_STATE_WAITOPEN);
                this.noticeLabel.string = msgcode.TUIBING_STATE_WAITOPEN;
                this._timer = TuiBingConfig.Time.Wait;
            }break;
            case TuiBingConfig.State.Openning:{
                // cc.ll.msgbox.addMsg(msgcode.TUIBING_STATE_OPENNING);
                this.noticeLabel.string = msgcode.TUIBING_STATE_OPENNING;
                this._timer = TuiBingConfig.Time.Open;
            }break;
            case TuiBingConfig.State.Reward:{
                // cc.ll.msgbox.addMsg(msgcode.TUIBING_STATE_REWARD);
                this.noticeLabel.string = msgcode.TUIBING_STATE_REWARD;
                this._timer = TuiBingConfig.Time.Reward; 
            }break;
        }
    },

    onPlayerBet : function ( id, pos, gold ){
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
        if ( gold < 100000 ){
            num = 1;
        }else if (gold >= 100000 && gold < 1000000) {
            num = 2;
        }else if (gold >= 1000000 ) {
            num = 3;
        }
        var node = cc.find( bgstr );
        var beginpos = cc.Vec2.ZERO;
        if(id == cc.ll.pMgr.main_role.id){
            var bnode = cc.find( "Canvas/GameBgLayer/ButtumBg/goldflag" );
            var world_pos = bnode.convertToWorldSpace( cc.Vec2.ZERO );
            var pos = node.convertToNodeSpace( world_pos );
            beginpos = pos;
        }
        
        for (var i = 0; i < num; i++) {
            var x = Math.round(Math.random()*node.width) - node.width / 2;
            x = x>0?x-30:x+30;
            var y = Math.round(Math.random()*node.height) - node.height / 2;
            y = y>0?y-30:y+30;
            var gold = cc.instantiate(this.goldPrefab);
            if (beginpos.x != 0) {
                gold.x = beginpos.x;
                gold.y = beginpos.y;    
            }else{
                gold.x = x;
                gold.y = y;
            }
            node.addChild( gold );
            var action = cc.moveTo( 0.5, cc.p(x,y) );
            gold.runAction( action.easing(cc.easeOut(3.0)) );
        }
        cc.ll.sAudioMgr.play("dropGold");
    },

    selectGoldBtn : function( key ) {
        for (var i = this.goldBtnLsit.length - 1; i >= 0; i--) {
            var btn = this.goldBtnLsit[i];
            var button = btn.getComponent(cc.Button);
            var num = parseInt(btn.node.name);
            if (num == key) {
                button.interactable = false;
                this._select_gold = num * TuiBingConfig.LessGold;
            } else {
                button.interactable = true;
            }
        }
    },

    onAutoSelectGold: function(){
        var max = cc.ll.pMgr.main_role.gold;
        var num = 0;
        for (var i = this.goldBtnLsit.length - 1; i >= 0; i--) {
            var btn = this.goldBtnLsit[i];
            var button = btn.getComponent(cc.Button);
            var select_num = parseInt(btn.node.name);
            var select_gold =  select_num * TuiBingConfig.LessGold;
            if( select_gold <= this._can_bet_gold ){
                if( select_gold <= max ){
                    num = select_num;
                    break;
                }
            }
        }
        if(num == 0){
            this.selectGoldBtn( 1 );
        }else{
            this.selectGoldBtn( num );
        }
    },

    onBetGold : function( event, pos ){
        if ( this._game_state != TuiBingConfig.State.Ready ){
            return;
        }
        var maxgold = cc.ll.pMgr.main_role.gold;
        if (maxgold < TuiBingConfig.LessGold){
            cc.ll.msgbox.addMsg(msgcode.GOLD_NOT_ENOUGH);
            return;
        }
        
        if (this._select_gold ==0) {
            cc.ll.msgbox.addMsg(msgcode.TUIBING_SELECT_GOLD);
            return;
        }

        if( this._select_gold > maxgold ){
            this.onAutoSelectGold();
            if( this._select_gold > maxgold ){
                cc.ll.msgbox.addMsg(msgcode.GOLD_NOT_ENOUGH);
                return; 
            }
        }

        if( this._select_gold > this._can_bet_gold ){
            this.onAutoSelectGold();
            if( this._select_gold > this._can_bet_gold ){
                cc.ll.msgbox.addMsg(msgcode.TUIBING_MORETHAN_BANKER);
                return; 
            }
        }
        
        var p = new packet( "ReqTuiBingBet" );
        p.lpack.pos = parseInt(pos);
        p.lpack.gold = this._select_gold;
        cc.ll.net.send( p.pack() );
    },

    onSelectGoldClick: function( event, gold ){
        var max = cc.ll.pMgr.main_role.gold;
        var select_gold = parseInt(gold);
        if (select_gold > max) {
            return;
        }
        
        var node = event.target;
        for (var i = 0; i < this.goldBtnLsit.length; i++) {
            var btn = this.goldBtnLsit[i];
            var button = btn.getComponent(cc.Button);
            button.interactable = btn.node.name != node.name;
        }
        this._select_gold = select_gold;
        cc.ll.sAudioMgr.playNormalBtnClick();
    },

    onBetGoldCount: function( goldlist ){
        var gold = 0;
        for (var i = 0; i < this.betPoolLabel.length; i++) {
            var label = this.betPoolLabel[i]
            var g = goldlist[i]
            label.string = g;
            gold += g;
        }
        
        this._can_bet_gold = this._banker_gold - gold;
    },
    DealMajiangPos : function( node, key ){
        var to_node_str = "";
        switch(key){
            case 1: to_node_str = "Canvas/GameBgLayer/TopBg/DizhuMajiangBg" ;break;
            case 2: to_node_str = "Canvas/GameBgLayer/GameBg/SouthMajiangBg" ;break;
            case 3: to_node_str = "Canvas/GameBgLayer/GameBg/SkyMajiangBg" ;break;
            case 4: to_node_str = "Canvas/GameBgLayer/GameBg/NorthMajiangBg" ;break;            
        };
        var to_node = cc.find( to_node_str );
        var world_topos = to_node.convertToWorldSpace(cc.Vec2.ZERO);
        var node_topos = node.parent.convertToNodeSpace( world_topos );
        this._mj_move_key ++;
        return node_topos;
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
        function shownum(){
            pointbg.active = true;
        }
        node.runAction( cc.sequence(cc.delayTime( 0.5 ), cc.callFunc( shownum ) )  )
    },

    // majiangs 0 banker 1 south 2 sky 3 north {majiang1 majiang2}
    onOpenMajiang: function( majiangs, dicenum1, dicenum2 ){
        // 先撒骰子
        var random_1 = dicenum1; //Math.ceil(Math.random()*5 + 1);
        var random_2 = dicenum2; //Math.ceil(Math.random()*5 + 1);

        this.dice.active = true;
        var action = this.dice.getComponent( cc.Animation )
        var majianglist = this.maJiangList
        var self = this;
        var dice1 = cc.find( "/Canvas/GameBgLayer/Dice1" )
        var dice2 = cc.find( "/Canvas/GameBgLayer/Dice2" )
        var key = (random_1+random_2-1)%4+1; // 1~4
        var list = [];
        for (var i = 0; i <= 3; i++) {
          list[i] = (key+i)>4?key+i-4:key+i;
        }
        var diceact = function(){
            action.play();
            cc.ll.sAudioMgr.play("touzi");
        }
        
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
        var move = function(){
            var id = 0;
            var moveto = function(){
                if(id > 3 || id < 0){
                    return;
                }
                var mj_key = list[id];
                var node = cc.find( "Canvas/GameBgLayer/MJList/group" + self._mj_move_key );
                var pos = self.DealMajiangPos( node, mj_key );
                function showmj(){
                    var majiangnode = self.maJiangList[mj_key-1];
                    majiangnode.active = true;
                }
                function hidegroup(){
                    node.active = false;
                }
                node.runAction(cc.sequence(cc.moveTo(0.5, pos), cc.callFunc(hidegroup), cc.callFunc(showmj)));
                id++;
            }
            var queue = [];
            queue.push(
                cc.callFunc( moveto ),
                cc.delayTime(0.5),
                cc.callFunc( moveto ),
                cc.delayTime(0.5),
                cc.callFunc( moveto ),
                cc.delayTime(0.5),
                cc.callFunc( moveto ),
                cc.delayTime(0.5),
            );
            self.node.runAction( cc.sequence(queue) )
        }
        var open = function( id ) {
            var node = majianglist[ id ];
            var nums = majiangs[ id ];
            self.OpenMajiang( node, nums );
        }
        var open1 = function(){open(0);}
        var open2 = function(){open(1);}
        var open3 = function(){open(2);}
        var open4 = function(){open(3);}

        var queue = [];
        queue.push(
            cc.callFunc( diceact ),//1 dice action begin 
            cc.delayTime(1.5),     
            cc.callFunc( stopact ), //2 dice action stop, show finaly number
            cc.delayTime(1),
            cc.callFunc( hidedice ), //3 hide dice
            cc.delayTime(0.5),
            cc.callFunc( move ),    //move majiang
            cc.delayTime(2.5),             
            cc.callFunc( open1 ),   // open majiang one by one
            cc.delayTime( 1  ),
            cc.callFunc( open2 ),
            cc.delayTime( 1  ),
            cc.callFunc( open3 ),
            cc.delayTime( 1  ),
            cc.callFunc( open4 )
        );
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
        if ( cc.ll.pMgr.main_role.id == this._banker_id ){
            this.btnBeBanker.node.active = false;
            this.btnUnBanker.node.active = true;
        }else{
            this.btnBeBanker.node.active = true;
            this.btnUnBanker.node.active = false;
        }
        this._can_bet_gold = this._banker_gold
    },
    testAddGold : function() {
        var self = this;
        function addgold( str ){
            var node = cc.find( str );
            var num = Math.ceil( Math.round(Math.random()*10) + 1);
            for( var i = 0; i < num; i++ ){
                var x = Math.round(Math.random()*node.width) - node.width / 2;
                x = x>0?x-30:x+30;
                var y = Math.round(Math.random()*node.height) - node.height / 2;
                y = y>0?y-30:y+30;
                var gold = cc.instantiate(self.goldPrefab);
                gold.x = x;
                gold.y = y;
                node.addChild( gold );
            }
        }
        var list = ["Canvas/GameBgLayer/GameBg/SouthBg","Canvas/GameBgLayer/GameBg/SkyBg","Canvas/GameBgLayer/GameBg/NorthBg"];
        for (var i = 0; i < list.length; i++) {
            addgold(list[i]);
        }
    },
    testSendReward : function() {
        var list = [0,1,0];
        var gold = 10;
        this.onSendReward( list, gold );
    },
    onSendReward : function(list, goldlist) {
        var bankernode = cc.find("Canvas/GameBgLayer/TopBg/DizhuGold");
        var bankerpos = bankernode.convertToWorldSpace( cc.Vec2.ZERO );
        var playernode = cc.find( "Canvas/GameBgLayer/ButtumBg/goldflag" );
        var playerpos = playernode.convertToWorldSpace( cc.Vec2.ZERO );
        var dazhongnode = cc.find( "Canvas/GameBgLayer/AllPlayerBtn" );
        var dazhongpos = dazhongnode.convertToWorldSpace( cc.Vec2.ZERO );
        // topos 0 banker 1 souch 2 sky 3 north 4 player
        function movegold( node, topos, delay ){
            var endpos = cc.p(0,0)
            if(topos == 4){
                endpos = node.parent.convertToNodeSpace( playerpos );
            }else if( topos == 5){
                endpos = node.parent.convertToNodeSpace( dazhongpos );
            }else{
                endpos = node.parent.convertToNodeSpace( bankerpos );
            }
            var d = delay || 0;
            var action = cc.moveTo( 0.5, endpos )
            function removenode(){
                node.removeFromParent()
            }
            node.runAction( cc.sequence( cc.delayTime(d), action.easing(cc.easeOut(3.0) ), cc.callFunc(removenode) ) );
            cc.ll.sAudioMgr.play("dropCoin");
        }
        // first banker win
        var self = this;
        var bankerwin = function(){
            for (var i = 0; i < list.length; i++) {
                var iswin = list[i];
                var bg = self.bgList[i];
                var children = bg.children;
                if(iswin == 0){//banker win
                    for (var k = children.length - 1; k >= 0; k--) {
                        movegold( children[k], 0 );
                    }
                }
            }
        }
        var banekerlose = function(){
            for (var i = 0; i < list.length; i++) {
                var iswin = list[i];
                var bg = self.bgList[i];
                var children = bg.children;
                if(iswin != 0){//banker win
                    var beginpos = bg.convertToNodeSpace( bankerpos );
                    var num = children.length;
                    for (var k = 0; k < num; ++k) {
                        var x = Math.round(Math.random()*bg.width) - bg.width / 2;
                        x = x>0?x-30:x+30;
                        var y = Math.round(Math.random()*bg.height) - bg.height / 2;
                        y = y>0?y-30:y+30;
                        var gold = cc.instantiate(self.goldPrefab);
                        gold.x = beginpos.x;
                        gold.y = beginpos.y;
                        bg.addChild( gold );
                        var action = cc.moveTo( 0.5, cc.p(x,y) );
                        gold.runAction( action.easing(cc.easeOut(3.0)) );
                    }
                    if( num > 0 ){
                        cc.ll.sAudioMgr.play("dropCoin");
                    }
                }
            }
        }
        var playerwin = function() {
            for (var i = 0; i < list.length; i++) {
                var iswin = list[i];
                var bg = self.bgList[i];
                var children = bg.children;
                var num = Math.ceil( children.length / 2 );
                if(iswin != 0){//player win
                    if ( goldlist[ i ] <= 0 ){
                        num = -1;
                    }
                    for (var k = 0; k < children.length; ++k) {
                        if(k <= num){
                            movegold(children[k], 4);
                        }else{
                            movegold(children[k], 5, 0.5);
                        }
                    }
                }
            }
        }
        this.node.runAction( cc.sequence( 
            cc.callFunc( bankerwin ),
            cc.delayTime( 0.8 ),
            cc.callFunc( banekerlose ),
            cc.delayTime( 0.8 ),
            cc.callFunc( playerwin ),
        ));
    },

    canBeBanker : function(){
        if ( cc.ll.pMgr.main_role.id == this._banker_id ){
            return ErrorCode.UR_BANKER;
        }
        for (var i = 0; i < this._be_banker_list.length; i++) {
            var info = this._be_banker_list[i]
            if( cc.ll.pMgr.main_role.id == info.playerid ){
                return ErrorCode.HAS_IN_QUEUE
            }
        }
        return 0;
    },

    onShowAllPlayer : function( list ){
        var node = cc.find("Canvas/GameBgLayer/AllPlayerList/pview/pcontent");
        node.removeAllChildren()
        for (var i = 0; i < list.length; i++) {
            var info = list[i]
            var item = cc.instantiate(this.itemPreforb);
            var sprite = item.getComponent("PreBankerItem");
            sprite.onChangeName( 2, info.id, info.name, 1 );
            item.x = 0;
            item.y = - i * 40;
            node.addChild( item )
        }
        node.height = list.length * 40;
        var node = cc.find("Canvas/GameBgLayer/AllPlayerList/detail");
        node.active = false;
    },

    onShowPlayerDetail : function ( from, id, name ){
        if(from == 2){
            var detail = cc.find( "Canvas/GameBgLayer/AllPlayerList/detail" );
            if(detail.active == false){
                detail.active = true;
            }
            var idnode = detail.getChildByName("ID");
            var idlabel = idnode.getComponent( cc.Label );
            if (idlabel.string == id) {
                idlabel.string = 0;
                detail.active = false;
                return;
            }
            idlabel.string = id;
            
            var namenode = detail.getChildByName("Name");
            var namelabel = namenode.getComponent( cc.Label );
            namelabel.string = name;
        }
    },

    onGmAddGoldClicked: function(event, data){
        if( this._gmPrefab == null ){
            return;
        }
        var node = cc.instantiate(this._gmPrefab);
        var bg = cc.find( "Canvas" )
        node.parent = bg;
    },
});
