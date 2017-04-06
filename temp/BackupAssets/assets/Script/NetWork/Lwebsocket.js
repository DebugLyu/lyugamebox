var common = require('Common');
var ProtoBuf = require("protobuf");
var m = require("msgdispatch");
var ByteBuffer = require("bytebuffer");


var LWebSocket = function(addr, port){
    this.address = addr;
    this.port = port;
    var ws = new WebSocket('ws://'+addr+':'+port+'/ws');
    ws.onopen = function (event) {
        console.log("Send Text WS was opened.");
    };
    ws.onmessage = function (event) {
        console.log("response text msg: " + event.data);
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {
            // reader.result contains the contents of blob as a typed array
            var data = this.result;
            var ndata = new ByteBuffer();
            ndata.append( data );
            ndata.flip();
            var len = ndata.readShort();
            var head = ndata.readString(len);
            m.dispatch(head, ndata.toBuffer());
            });
        reader.readAsArrayBuffer(event.data);
    };
    ws.onerror = function (event) {
        console.log("Send Text fired an error");
    };
    ws.onclose = function (event) {
        console.log("WebSocket instance closed.");
    };
    this.socket = ws;

    this.send = function(buffer){
        this.socket.send(buffer);
    }
}

module.exports = LWebSocket;

// cc.Class({
//     name: "Lwebsocket",
//     extends: cc.Component,
//     properties: {
//     	address: "",
//     	port: 0,
//     	socket: null,
//     },

//     ctor: function( addr, port ){
//     	this.address = addr;
//     	this.port = port;

//     	var ws = new WebSocket('ws://'+addr+':'+port+'/ws');
//     	ws.onopen = function (event) {
//             console.log("Send Text WS was opened.");
//         };
//         ws.onmessage = function (event) {
//             console.log("response text msg: " + event.data);
//             var reader = new FileReader();
//             reader.addEventListener("loadend", function() {
//                // reader.result contains the contents of blob as a typed array
//                var data = this.result;
//                var ndata = new ByteBuffer();
//                ndata.append( data );
//                ndata.flip();
//                var len = ndata.readShort();
//                var head = ndata.readString(len);
//                m.dispatch(head, ndata.toBuffer());
//             });
//             reader.readAsArrayBuffer(event.data);

//         };
//          ws.onerror = function (event) {
//              console.log("Send Text fired an error");
//          };
//          ws.onclose = function (event) {
//              console.log("WebSocket instance closed.");
//          };
//          this.socket = ws;
//     }
// })