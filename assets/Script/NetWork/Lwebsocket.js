var ByteBuffer = require("bytebuffer");

var SocketState = {
    UnInit : 0,
    Linking : 1,
    Linked : 2,
    Close : 3,
}

var lwebsocket = cc.Class({
    // extends: cc.Component,
    name : "lwebsocket",
    statics: {
        ip : "",
        port : 0,
        reader : null,
        socket : null,
        state : SocketState.UnInit,
        msgdispatch : null,
        queue : null,
        working : false,

        init : function(){
            var self = this;
            this.reader = new FileReader();
            this.reader.addEventListener( "loadend", function(){
                var data = this.result;
                var buffer = new ByteBuffer();
                buffer.append( data )
                buffer.flip();
                var len = buffer.readShort();
                var head = buffer.readString( len );
                console.log("response text msg: " + head);
                self.msgdispatch.dispatch( head, buffer.toBuffer() )
                // self.working = false;
                self.domessage();
            });
            this.reader.addEventListener( "onerror", function(){
                // self.working = false;
                self.domessage();
            });

            this.queue = new Array();
            this.msgdispatch = require("msgdispatch");
        },
        domessage : function () {
            if( this.reader.readyState != 1 ){
                if ( this.queue.length > 0 ){
                    var data = this.queue.shift();
                    this.reader.readAsArrayBuffer(data);
                }
            }
        },
        connect:function(ip, port, fnConnect, fnError) {
            var self = this;
            this.ip = ip;
            this.port = port;
            var ws = new WebSocket('ws://'+this.ip+':'+this.port+'/ws');
            ws.onopen = function (event) {
                console.log("Send Text WS was opened.");
                self.state = SocketState.Linked;
                if( fnConnect ){
                    fnConnect()
                }
            };
            ws.onmessage = function (event) {
                // console.log("response text msg: " + event.data);
                self.queue.push( event.data );
                if(self.queue.length > 0){
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
                if(fnError){
                    fnError()
                } 
            };
            this.socket = ws;
        },
        send : function(buffer){
            this.socket.send(buffer);
        },
    },
});

module.exports = lwebsocket;