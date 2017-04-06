"use strict";
cc._RFpush(module, 'a9018RzxbpHBprCCxM5pGdP', 'Lwebsocket');
// Script/NetWork/Lwebsocket.js

"use strict";

var ByteBuffer = require("bytebuffer");
var ProtoBuf = require("protobuf");

var SocketState = {
    UnInit: 0,
    Linking: 1,
    Linked: 2,
    Close: 3
};

var lwebsocket = cc.Class({
    extends: cc.Component,
    statics: {
        ip: "",
        port: 0,
        reader: null,
        socket: null,
        state: SocketState.UnInit,
        msgdispatch: null,
        queue: null,
        working: false,

        init: function init() {
            var self = this;
            this.reader = new FileReader();
            this.reader.addEventListener("loadend", function () {
                var data = this.result;
                var buffer = new ByteBuffer();
                buffer.append(data);
                buffer.flip();
                var len = buffer.readShort();
                var head = buffer.readString(len);
                console.log("response text msg: " + head);
                self.msgdispatch.dispatch(head, buffer.toBuffer());
                self.working = false;
                self.domessage();
            });

            this.queue = new Array();
            this.msgdispatch = require("msgdispatch");
        },
        domessage: function domessage() {
            if (!this.working) {
                var data = this.queue[0];
                if (data != null) {
                    this.working = true;
                    this.queue.shift();
                    this.reader.readAsArrayBuffer(data);
                }
            }
        },
        connect: function connect(ip, port, fnConnect, fnError) {
            var self = this;
            this.ip = ip;
            this.port = port;
            var ws = new WebSocket('ws://' + this.ip + ':' + this.port + '/ws');
            ws.onopen = function (event) {
                console.log("Send Text WS was opened.");
                self.state = SocketState.Linked;
                if (fnConnect) {
                    fnConnect();
                }
            };
            ws.onmessage = function (event) {
                // console.log("response text msg: " + event.data);
                self.queue.push(event.data);
                if (self.queue.length > 0) {
                    self.domessage();
                }
            };
            ws.onerror = function (event) {
                console.log("Send Text fired an error");
                self.state = SocketState.Close;
            };
            ws.onclose = function (event) {
                console.log("WebSocket instance closed.");
                self.state = SocketState.Close;
                if (fnError) {
                    fnError();
                }
            };
            this.socket = ws;
        },
        send: function send(buffer) {
            this.socket.send(buffer);
        }
    }
});

// var ProtoBuf = require("protobuf");
// var ByteBuffer = require("bytebuffer");


// var LWebSocket = function(addr, port){
//     this.address = addr;
//     this.port = port;
//     this.callback = null;
//     this.state = 0; // 0 un init 1 unlink 2 linked 3 linking

//     var queue = new Array();
//     this.reader = new FileReader();

//     var working = false;
//     var doMessage;
//     var msgdispatch = require("msgdispatch");
//     this.reader.addEventListener("loadend", function() {
//         // reader.result contains the contents of blob as a typed array
//         var data = this.result;
//         var ndata = new ByteBuffer();
//         ndata.append( data );
//         ndata.flip();

//         var len = ndata.readShort();
//         var head = ndata.readString(len);
//         console.log("response text msg: " + head);
//         msgdispatch.dispatch(head, ndata.toBuffer());
//         working = false;
//         doMessage();
//     });

//     var c = this.reader;
//     doMessage = function(){
//         if(!working){
//             var data = queue[0];
//             if (data != null){
//                 working = true;
//                 queue.shift();
//                 c.readAsArrayBuffer(data);
//             }
//         }
//     }

//     var self = this;


//     this.send = function(buffer){
//         this.socket.send(buffer);
//     };

//     this.connect = function(){
//         self.state = 3;
//         var ws = new WebSocket('ws://'+self.address+':'+self.port+'/ws');
//         ws.onopen = function (event) {
//             console.log("Send Text WS was opened.");
//             self.state = 2;
//             require('Common').reSetTimes();
//             if(self.callback != null){
//                 self.callback.env[ self.callback.func ]();
//             }
//             self.callback = null;
//         };
//         ws.onmessage = function (event) {
//             // console.log("response text msg: " + event.data);
//             queue.push( event.data );
//             if(queue.length > 0){
//                 doMessage();
//             }
//         };
//         ws.onerror = function (event) {
//             console.log("Send Text fired an error");
//         };
//         ws.onclose = function (event) {
//             console.log("WebSocket instance closed.");
//             self.state = 1; 
//             require('Common').reLogin();
//         };
//         this.socket = ws;
//     }

//     this.registerCallback = function( func, env ){
//         var obj = {env:env, func: func};
//         self.callback = obj;
//     };

// }

// module.exports = LWebSocket;

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

cc._RFpop();