var lsockte = require("Lwebsocket")
var ProtoBuf = require("protobuf")
var notice = require("Notice")
var msgcode = require( 'Msgcode' )
var packet = require( 'Lpackage' )

var cmm = (function(){
    // var Return = {
    //     Property: "Test Static Property",    //公有属性
    //     Method: function(){    //公有方法
    //         alert(_Field);    //调用私用字段
    //         privateMethod();    //调用私用方法
    //     },
    // };    //定义返回的公有对象
 
    // var _Field = "Test Static Field";    //私有字段
    // var privateMethod = function(){    //私有方法
    //     alert(Return.Property);    //调用属性
    // }

    var _isinit = false;
 	var _pb = null;
 	var _ip = "194.168.0.179"
 	var _socket = new lsockte(_ip,8001);
 	var _link_times = 0;
 	
 	var Return = {
 		init: function(){
 			cc.loader.loadRes("gamebox", function (err, arr){
 				_pb = ProtoBuf.protoFromString(arr); 
 			});
 			var lsockte = require("Lwebsocket");
 			_isinit = true;
 		},
 		reSetTimes: function () {
 			_link_times = 0;
 		},
 		getNetworkState: function(){
 			return _socket.state;// 0 un init 1 unlink 2 linker
 		},
 		connect :function (){
 			console.log("state "+this.getNetworkState());
 			if(this.getNetworkState() == 3){
 				return;
 			}	

 			_socket.connect();
 			_link_times += 1;
 		},
 		getPb: function() {
 			return _pb;
 		},
 		getSocket: function() {
 			return _socket;
 		},
 		send: function( buffer ) {
 			_socket.send(buffer);
 		},
 		connectWithFunc: function(func, env){
 			_socket.registerCallback(func,env);
 			this.connect();
 		},

 		reloginToMainView: function(){
 			var account = cc.sys.localStorage.getItem('account');
 			var password = cc.sys.localStorage.getItem('password');
 			var p = new packet( "Reqlogin" );
		    p.lpack.account = account;
		    p.lpack.password = password;
		    _socket.send(p.pack());
 		},

 		reLogin: function() {
 			if ( _link_times > 3 ){
 				_link_times = 0;
				notice.getInstance().addMsg(2,msgcode.NETWORK_UNCONNECT,null,null,908);
				return;
			}
 			var scenename = cc.director.getScene().name;
 			if( scenename == "" || scenename == "loadingview" || scenename == "loginview"){
 				this.connect();
 				return;
 			}

 			var type = 0; // 0 do nothing 1 back to loginview 2 auto relink and to mainview
			var msg = "";
 			var account = cc.sys.localStorage.getItem('account');
 			var password = cc.sys.localStorage.getItem('password');

 			if (account != null && account != ""){
 				msg = msgcode.NETWORK_RELINK;
 				type = 2;
 			}else{
 				msg = msgcode.NETWORK_RELOGIN;
 				type = 1;
 			}
 			var self = this;
 			var callback = function() {
 				if(type == 1){
 					cc.director.loadScene("loginview");
 				}else if (type == 2) {
					self.connectWithFunc( "reloginToMainView", self )
 				}
 				notice.getInstance().removeMsg( 908 );
 			}
 			notice.getInstance().addMsg(2,msg,callback,null,908);
 		}
 	};
    return Return;    //生成公有静态元素
})();

module.exports = cmm;

// var StaticClass = (function(){
//     var Return = {
//         Property: "Test Static Property",    //公有属性
//         Method: function(){    //公有方法
//             alert(_Field);    //调用私用字段
//             privateMethod();    //调用私用方法
//         },
//     };    //定义返回的公有对象
 
//     var _Field = "Test Static Field";    //私有字段
//     var privateMethod = function(){    //私有方法
//         alert(Return.Property);    //调用属性
//     }
//     return Return;    //生成公有静态元素
// })();
