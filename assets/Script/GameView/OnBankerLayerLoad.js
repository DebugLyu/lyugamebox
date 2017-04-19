var TuiBingConfig = require("TuiBingConfig")
var packet = require( 'Lpackage' )

cc.Class({
    extends: cc.Component,

    properties: {
        bar : cc.ProgressBar,
        input : cc.EditBox,
        checkbox : cc.Toggle,
        fasttips : cc.Label,

        _is_keep : false,
    },

    // use this for initialization
    onLoad: function () {
       
    },

    initKeep: function() {
        this.checkbox.interactable = false;
        this.fasttips.node.color = new cc.Color(140, 140, 140);
        this._is_keep = true;
    },

    onSlideChanged : function (slider, customEventData ){
        var size = slider.progress;
        this.bar.progress = size;

        var maxgold = cc.ll.pMgr.main_role.gold;
        var need = TuiBingConfig.BankerLessGold;
        if( this.checkbox.isChecked ){
            need = TuiBingConfig.BankerLessGold + TuiBingConfig.FastBankerGold;
        }
        var sgold = maxgold - need;
        
        this.input.string = TuiBingConfig.BankerLessGold + Math.ceil(sgold*size);
    },

    onCheckBoxClicked : function(toggle, customEventData) {
        if( toggle.isChecked ){
            var maxgold = cc.ll.pMgr.main_role.gold;
            if( maxgold < TuiBingConfig.BankerLessGold + TuiBingConfig.FastBankerGold ){
                toggle.isChecked = false;
                cc.ll.msgbox.addMsg(msgcode.TUIBING_GOLD_NOT_ENOUGH);
            }else{
                var gold = Number(this.input.string);
                var max = maxgold - (TuiBingConfig.BankerLessGold + TuiBingConfig.FastBankerGold);
                if( gold > max ){
                    this.input.string = TuiBingConfig.BankerLessGold + max;
                }
            }
        }
        cc.ll.sAudioMgr.playNormalBtnClick();
    },

    onOkClicked : function(){
        var bankertype = 1;
        if (this.checkbox.isChecked) {
            bankertype = 2;
        }
        
        var gold = Number(this.input.string);
        if (gold < TuiBingConfig.BankerLessGold) {
            cc.ll.msgbox.addMsg(msgcode.TUIBING_GOLD_NOT_ENOUGH);
            return
        }
        var need = gold;
        if( this.checkbox.isChecked ){
            need = TuiBingConfig.BankerLessGold + TuiBingConfig.FastBankerGold;
        }
        var maxgold = cc.ll.pMgr.main_role.gold;
        if( maxgold < need ){
            cc.ll.msgbox.addMsg(msgcode.TUIBING_GOLD_BANKER_NOT_ENOUGH);
            return
        }

        if( this._is_keep ){
            var p = new packet( "ReqKeepBanker" );
            p.lpack.iskeep = 0;
            p.lpack.gold = gold;
            cc.ll.net.send( p.pack() );
        }else{
            var p = new packet( "ReqBeBanker" );
            p.lpack.type = bankertype;
            p.lpack.gold = Number( this.input.string );
            cc.ll.net.send( p.pack() ); 
        }
        
        cc.ll.sAudioMgr.playNormalBtnClick();
        this.onDistroy();
    },
    onCancelClicked : function() {
        if( this._is_keep ){
            var p = new packet( "ReqKeepBanker" );
            p.lpack.iskeep = 1;
            p.lpack.gold = 0;
            cc.ll.net.send( p.pack() );
        }
        cc.ll.sAudioMgr.playNormalBtnClick();
        this.onDistroy();
    },

    onDistroy:function(){
        this.node.destroy();
    },
});
