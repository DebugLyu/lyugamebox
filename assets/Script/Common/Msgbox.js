var msgcode = require( 'Msgcode' )

var Msgbox = cc.Class({
    // extends: cc.Component,
    properties: {

    },
    statics: {
        bg : null,
        addMsg : function( msg ) {
            if ( this.bg === null ){
                this.bg = cc.find("MsgBoxLayer");
                cc.game.addPersistRootNode(this.bg);
                if( this.bg === null ){
                    return;
                }
            }
            if( typeof( msg ) == "number" ){
                msg = msgcode[ msg ];
            }
            var msgnode = new cc.Node();
            msgnode.color = cc.color(0, 255, 68, 255);
            var msglabel = msgnode.addComponent(cc.Label);
            msglabel.string = msg;
            msglabel.fontSize = 20;
            msgnode.setPosition( 0, -50 );
            msgnode.parent = this.bg;
            var dellabel = function(){
                msgnode.destroy();
            };  
            var act1 = cc.moveBy(1, cc.p(0, 100));
            var act21 = cc.delayTime(0.5);
            var act22 = cc.fadeOut(0.5);
            var act23 = cc.callFunc( dellabel )
            var act2 = cc.sequence(act21, act22, act23);
            
            msgnode.runAction(act1);
            msgnode.runAction(act2);
        },
    },
});
module.exports = Msgbox;