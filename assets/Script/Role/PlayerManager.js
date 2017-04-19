// PlayerManager.js

var pMgr = cc.Class({
    properties: {
        _role_list : null,
    },
    statics : {
        main_role : null,
        init : function(){
            this._role_list = new Array();
        },
        addPlayer: function( role ){
            this._role_list[ role.id ] = role;
        },
    },
});

module.exports = pMgr;