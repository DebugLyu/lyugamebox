var packet = require( "Lpackage" )
var msgcode = require( 'Msgcode' )
var pMgr = require("PlayerManager").getInstance()
var player = require('Player')
var sSceneMgr = require("SceneManager")
var TuiBingConfig = require("TuiBingConfig")

var onLogin = function( pack ){
    var result = pack.result;
    if ( result == 0 ) {
        var obj = {id:pack.id, name:pack.name, gold:pack.gold}
        var pPlayer = new player();
        pPlayer.login(obj)
    }else{
        cc.ll.msgbox.addMsg(result);
    }
}

var onRegister = function( pack ){
    var result = pack.result ;
    if ( result != 0 ){
        cc.ll.msgbox.addMsg(result);
    }
}

var onEnterRoom = function( pack ){
    var result = pack.result;
    if (result == 0) {
        sSceneMgr.onChangeScene("tuibingview");
    }else{
        cc.ll.msgbox.addMsg(result);
    }
}

var onBeBanker = function( pack ){
    var result = pack.result;
    if (result != 0 ){
        cc.ll.msgbox.addMsg(result);
    }
}

var onTuibingUnbanker = function( pack ){
    var result = pack.result;
    if (result != 0 ){
        cc.ll.msgbox.addMsg(result);
    }
}

var onTuibingLeaveQueue = function( pack ){
    var result = pack.result;
    if (result != 0 ){
        cc.ll.msgbox.addMsg(result);
    }
}

var onTuiBingQueueChange = function( pack ) {
    var node = cc.find("Canvas/GameBgLayer");
    if( node ){
        var gamelogic = node.getComponent("GameLogic");
        var banker = { 
            bankerid: pack.bankerid,  
            bankername : pack.bankername,
        }
        gamelogic.onQueueChanged(banker, pack.queue);
    }
}

var onTuiBingGameState = function( pack ){
    var state = pack.state
    var node = cc.find("Canvas/GameBgLayer");
    if( node ){
        var gamelogic = node.getComponent( "GameLogic" );
        gamelogic.onGameStateChange( state )
    }
    if (state == TuiBingConfig.State.WaitOpen) {
        cc.ll.notice.removeMsg(998);
    }
}

var onGoldChange = function( pack ){
    var gold = pack.gold;
    pMgr.main_role.onGoldChanged( gold );
}

var onTuiBingBet = function( pack ) {
    var result = pack.result;
    var id = pack.id;
    var pos = pack.pos;
    var gold = pack.gold;
    if (result == 0){
        var node = cc.find("Canvas/GameBgLayer");
        if( node ){
            var gamelogic = node.getComponent( "GameLogic" );
            gamelogic.onGoldAction( id, pos, gold )
        }
    }else{
        cc.ll.msgbox.addMsg(result);
    }
}

var onKeepBanker = function( pack ) {
    let begincallback = function() {
        var p = new packet( "ReqKeepBanker" );
        p.lpack.iskeep = 0;
        p.lpack.gold = 200000;
        cc.ll.net.send( p.pack() );
    }
    let endcallback = function() {
        //下庄
        var p = new packet( "ReqKeepBanker" );
        p.lpack.iskeep = 1;
        p.lpack.gold = 0;
        cc.ll.net.send( p.pack() );
    }
    cc.ll.notice.addMsg(1,msgcode.TUIBING_KEEP_BANKER, begincallback, endcallback, 998);
}

var onBankerBegin = function( pack ) {
    let begincallback = function() {
        var p = new packet( "ReqTuiBingBegin" );
        cc.ll.net.send( p.pack() );
    }
    let endcallback = function() {
        //下庄
        var p = new packet( "ReqKeepBanker" );
        p.lpack.iskeep = 1;
        p.lpack.gold = 0;
        cc.ll.net.send( p.pack() );
    }
    cc.ll.notice.addMsg(1,msgcode.TUIBING_BANKER_BEGIN, begincallback, endcallback, 998)
}

var onTuiBingBetGold = function( pack ) {
    var gold = pack.gold;
    var node = cc.find("Canvas/GameBgLayer");
    if( node ){
        var gamelogic = node.getComponent( "GameLogic" );
        // gamelogic.onGoldAction( gold )
        gamelogic.onBetGoldCount( gold );
    }
}

var onDealMajiang = function( pack ) {
    var majiangs = pack.majiangs
    var node = cc.find("Canvas/GameBgLayer");
    if( node ){
        var gamelogic = node.getComponent( "GameLogic" );
        // gamelogic.onGoldAction( gold )
        gamelogic.onOpenMajiang( majiangs );
    }
}

var onCloseClient = function( pack ) {
    var type = pack.type
    if(type == 1){
        let okcallback = function(argument) {
            sSceneMgr.onChangeScene("loginview");
        }
        cc.ll.notice.addMsg ( 2, msgcode.NETWORK_OTHER_LOGIN, okcallback);
    }
}

var onTuibingBankerInfo = function( pack ) {
    var obj = {
        name:pack.name,
        id : pack.id,
        gold : pack.gold,
        times : pack.times,
    };
    var node = cc.find("Canvas/GameBgLayer");
    if( node ){
        var gamelogic = node.getComponent( "GameLogic" );
        gamelogic.onBankerInfo( obj );
    }
}

var onResKeepBanker = function( pack ) {
    var result = pack.result;
    if (result != 0 ){
        cc.ll.msgbox.addMsg(result);
    }
}

var FuncMap = {
    "Reslogin": onLogin,
    "ResRegister" : onRegister,
    "ResEnterRoom" : onEnterRoom,
    "ResBeBanker" : onBeBanker,
    "ResTuiBingQueueChange" : onTuiBingQueueChange,
    "ToTuiBingGameState" : onTuiBingGameState,
    "ToGoldChange" : onGoldChange,
    "ResTuiBingBet" : onTuiBingBet,
    "ToKeepBanker" : onKeepBanker,
    "ResKeepBanker" : onResKeepBanker,
    "ToBankerBegin" : onBankerBegin,
    "ToTuiBingBetGold" : onTuiBingBetGold,
    "ToDealMajiang" : onDealMajiang,
    "ToCloseClient" : onCloseClient,
    "ToTuibingBankerInfo" : onTuibingBankerInfo,
    "ResTuiBingUnbanker" : onTuibingUnbanker,
    "ResTuibingLeaveQueue" : onTuibingLeaveQueue,
}

var msgdispatch = cc.Class({
    // extends: cc.Component,
    name : "MsgDispatch",
    statics:{
        dispatch : function(head, buffer){
            var func = FuncMap[head];
            if (func !== null) {
                var p = new packet( head );
                p.unpack( buffer );
                func( p.msg );
            }
        },
    },
})
module.exports = msgdispatch;