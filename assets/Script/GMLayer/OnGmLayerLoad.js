var packet = require( 'Lpackage' )
var TuiBingConfig = require("TuiBingConfig")
cc.Class({
    extends: cc.Component,

    properties: {
        ToggleList : [ cc.Toggle ],
        _logic : null,
    },

    // use this for initialization
    onLoad: function () {
        var bglayer = cc.find("Canvas/GameBgLayer")
        this._logic = bglayer.getComponent("GameLogic");
    },

    onUnableAll : function(){
        for (var i = this.ToggleList.length - 1; i >= 0; i--) {
            var toggle = this.ToggleList[i];
            toggle.interactable = false;
        }
    },

    onEnableAll : function() {
        for (var i = this.ToggleList.length - 1; i >= 0; i--) {
            var toggle = this.ToggleList[i];
            toggle.interactable = true;
        }
    },

    onResetAll : function() {
        for (var i = this.ToggleList.length - 1; i >= 0; i--) {
            var toggle = this.ToggleList[i];
            toggle.isChecked = false;
        }
    },

    onSendG: function( event, data ){
        var num = Number(data);
        var pos = Math.ceil( num / 2 ) ;
        var win = (num+1) % 2 + 1;
        var toggle = event;
        if (toggle.isChecked){

        } else {
            win = 0;
        }

        if( this._logic._game_state == TuiBingConfig.State.Ready || 
            this._logic._game_state == TuiBingConfig.State.WaitOpen ){
            var p = new packet( "ReqSendWin" );
            p.lpack.pos = pos;
            p.lpack.win = win;
            cc.ll.net.send( p.pack() );
        }
    },
});
