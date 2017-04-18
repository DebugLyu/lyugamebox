var packet = require( "Lpackage" )
var msgcode = require( 'Msgcode' )
var TuiBingConfig = require("TuiBingConfig")

var onLogin = function( pack ){
    var result = pack.result;
    if ( result == 0 ) {
        var obj = {id:pack.id, name:pack.name, gold:pack.gold, gm:pack.gmlevel}
        var player = require('Player')
        var pPlayer = new player();
        pPlayer.login(obj)
    }else{
        cc.ll.msgbox.addMsg(result);
        cc.ll.loading.removeLoading();
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
        cc.ll.sSceneMgr.onChangeScene("tuibingview");
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
    if (state == TuiBingConfig.State.Ready) {
        cc.ll.notice.removeMsg(998);
    }
}

var onGoldChange = function( pack ){
    var gold = pack.gold;
    cc.ll.pMgr.main_role.onGoldChanged( gold );
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
            gamelogic.onPlayerBet( id, pos, gold )
        }
    }else{
        cc.ll.msgbox.addMsg(result);
    }
}

var onKeepBanker = function( pack ) {
    // let begincallback = function() {
    //     var p = new packet( "ReqKeepBanker" );
    //     p.lpack.iskeep = 0;
    //     p.lpack.gold = 200000;
    //     cc.ll.net.send( p.pack() );
    // }
    // let endcallback = function() {
    //     //下庄
    //     var p = new packet( "ReqKeepBanker" );
    //     p.lpack.iskeep = 1;
    //     p.lpack.gold = 0;
    //     cc.ll.net.send( p.pack() );
    // }
    // cc.ll.notice.addMsg(1,msgcode.TUIBING_KEEP_BANKER, begincallback, endcallback, 998);
    var node = cc.find("Canvas/GameBgLayer");
    if( node ){
        var gameviewload = node.getComponent( "OnGameViewLoad" );
        gameviewload.onShowKeepBanker()
    }
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
    var goldlist = pack.gold;
    var node = cc.find("Canvas/GameBgLayer");
    if( node ){
        var gamelogic = node.getComponent( "GameLogic" );
        // gamelogic.onGoldAction( gold )
        gamelogic.onBetGoldCount( goldlist );
    }
}

var onDealMajiang = function( pack ) {
    var majiangs = pack.majiangs
    var dice1 = pack.dice1
    var dice2 = pack.dice2
    var node = cc.find("Canvas/GameBgLayer");
    if( node ){
        var gamelogic = node.getComponent( "GameLogic" );
        // gamelogic.onGoldAction( gold )
        gamelogic.onOpenMajiang( majiangs, dice1, dice2 );
    }
}

var onCloseClient = function( pack ) {
    var type = pack.type
    if(type == 1){
        let okcallback = function(argument) {
            cc.ll.sSceneMgr.onChangeScene("loginview");
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

var onToTuiBingResult = function( pack ) {
    var winlist = pack.iswiner;
    var goldlist = pack.posgold;
    var node = cc.find("Canvas/GameBgLayer");
    if( node ){
        var gamelogic = node.getComponent( "GameLogic" );
        gamelogic.onSendReward( winlist, goldlist );
    }
}

var onTuibingAllPlayer = function( pack ){
    var list = pack.list;
    var node = cc.find("Canvas/GameBgLayer");
    if( node ){
        var gamelogic = node.getComponent( "GameLogic" );
        gamelogic.onShowAllPlayer( list );
    }
}

var onAddGold = function( pack ){
    var result = pack.result;
    if (result == 0) {
        cc.ll.msgbox.addMsg(msgcode.GM_PAYMENT_OK);
    } else {
        cc.ll.msgbox.addMsg(result);
    }
    // cc.ll.loading.removeLoading();
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
    "ToTuiBingResult" : onToTuiBingResult,
    "ResTuiBingAllPlayer" : onTuibingAllPlayer,
    "ResAddGold" : onAddGold,
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