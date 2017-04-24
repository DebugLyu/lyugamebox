var LLEvent = cc.Class({
    // extends: cc.Component,
    properties: {

    },
    statics: {
    	Index : 1000,
    	RegIndex : 1000,
    	EventQueue : new Object,
    	RegQueue : new Object,

    	addEvent : function( func ){
    		if( func == null || typeof(func) != "function" ){
    			return 0;
    		}
    		this.Index ++;
    		this.EventQueue[this.Index] = func;
    		return this.Index;
    	},

    	delEvent : function( id ){
    		this.EventQueue[id] = null;
    	},

    	dispatchEvent : function( id, obj ){
    		var func = this.EventQueue[id];
    		if( typeof(func) == "function" ){
    			func(obj);
    		}
    	},

    	register : function( key, node, func ){
    		if( func == null || typeof(func) != "function" ){
    			return;
    		}
    		if (this.RegQueue[key] == null){
    			this.RegQueue[key] = {};
    		}
    		this.RegQueue[key][this.RegIndex] = func;
    		return this.RegIndex;
    	},
    	unregister : function( key, node ) {
    		this.RegQueue[key][node] = null;
    	},

    	dispatchRegister : function( key ) {

    	},
    },
});

module.exports = LLEvent;