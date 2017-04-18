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
        _PlayerName : null,
        _ID:0,
        _Type:0,
        _From : 0,
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onChangeName: function( from, id, name, type ) {
        this._ID = id;
        this._PlayerName = name;
        this._Type = type;
        this._From = from;
        var label = this.getComponent(cc.Label);
        label.string = name
        if(type == 1){
            this.node.color = new cc.Color(255, 255, 255);
        }else if(type == 2){
            this.node.color = new cc.Color(255, 165, 0);
        }
    },

    onNameClicked : function () {
        var bg = cc.find( "Canvas/GameBgLayer" );
        var logic = bg.getComponent( "GameLogic" );
        logic.onShowPlayerDetail( this._From, this._ID, this._PlayerName )
    },
});
