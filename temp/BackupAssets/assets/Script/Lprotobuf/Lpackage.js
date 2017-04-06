//Lpackage.js
var ByteBuffer = require("bytebuffer");
//var common = require("Common");

var Lpackage = function( head ){
	var common = require("Common");
	this.head = head;
	var tHead = "tutorial." + head;
	this.builder = common.pb.build(tHead);
	this.lpack = new this.builder();

	this.pack = function(){
		var ret = new ByteBuffer();
	    // ret.writeShort( this.head.length );
		ret.writeString( this.head );
		ret.writeString( "||" )
		ret.append( this.lpack.encode() );
		ret.flip();
		return ret.toBuffer();
	};

	this.msg = null;
	this.unpack = function(buffer){
		if(buffer !== null){
			this.msg = this.builder.decode(buffer);
		}
		return this.msg;
	};
}
module.exports = Lpackage;