"use strict";
cc._RFpush(module, '9c1715pl4NNDKFgABFZBddN', 'Common');
// Script/Common/Common.js

"use strict";

var lsockte = require("Lwebsocket");
var ProtoBuf = require("protobuf");
var notice = require("Notice");
var msgcode = require('Msgcode');
var packet = require('Lpackage');

var cmm = function () {
  // var Return = {
  //     Property: "Test Static Property",    //��������
  //     Method: function(){    //���з���
  //         alert(_Field);    //����˽���ֶ�
  //         privateMethod();    //����˽�÷���
  //     },
  // };    //���巵�صĹ��ж���

  // var _Field = "Test Static Field";    //˽���ֶ�
  // var privateMethod = function(){    //˽�з���
  //     alert(Return.Property);    //��������
  // }

  var _isinit = false;
  var _pb = null;
  var _ip = "194.168.0.179";
  var _socket = new lsockte(_ip, 8001);
  var _link_times = 0;

  var Return = {
    init: function init() {
      cc.loader.loadRes("gamebox", function (err, arr) {
        _pb = ProtoBuf.protoFromString(arr);
      });
      var lsockte = require("Lwebsocket");
      _isinit = true;
    },
    reSetTimes: function reSetTimes() {
      _link_times = 0;
    },
    getNetworkState: function getNetworkState() {
      return _socket.state; // 0 un init 1 unlink 2 linker
    },
    connect: function connect() {
      console.log("state " + this.getNetworkState());
      if (this.getNetworkState() == 3) {
        return;
      }

      _socket.connect();
      _link_times += 1;
    },
    getPb: function getPb() {
      return _pb;
    },
    getSocket: function getSocket() {
      return _socket;
    },
    send: function send(buffer) {
      _socket.send(buffer);
    },
    connectWithFunc: function connectWithFunc(func, env) {
      _socket.registerCallback(func, env);
      this.connect();
    },

    reloginToMainView: function reloginToMainView() {
      var account = cc.sys.localStorage.getItem('account');
      var password = cc.sys.localStorage.getItem('password');
      var p = new packet("Reqlogin");
      p.lpack.account = account;
      p.lpack.password = password;
      _socket.send(p.pack());
    },

    reLogin: function reLogin() {
      if (_link_times > 3) {
        _link_times = 0;
        notice.getInstance().addMsg(2, msgcode.NETWORK_UNCONNECT, null, null, 908);
        return;
      }
      var scenename = cc.director.getScene().name;
      if (scenename == "" || scenename == "loadingview" || scenename == "loginview") {
        this.connect();
        return;
      }

      var type = 0; // 0 do nothing 1 back to loginview 2 auto relink and to mainview
      var msg = "";
      var account = cc.sys.localStorage.getItem('account');
      var password = cc.sys.localStorage.getItem('password');

      if (account != null && account != "") {
        msg = msgcode.NETWORK_RELINK;
        type = 2;
      } else {
        msg = msgcode.NETWORK_RELOGIN;
        type = 1;
      }
      var self = this;
      var callback = function callback() {
        if (type == 1) {
          cc.director.loadScene("loginview");
        } else if (type == 2) {
          self.connectWithFunc("reloginToMainView", self);
        }
        notice.getInstance().removeMsg(908);
      };
      notice.getInstance().addMsg(2, msg, callback, null, 908);
    }
  };
  return Return; //���ɹ��о�̬Ԫ��
}();

module.exports = cmm;

// var StaticClass = (function(){
//     var Return = {
//         Property: "Test Static Property",    //��������
//         Method: function(){    //���з���
//             alert(_Field);    //����˽���ֶ�
//             privateMethod();    //����˽�÷���
//         },
//     };    //���巵�صĹ��ж���

//     var _Field = "Test Static Field";    //˽���ֶ�
//     var privateMethod = function(){    //˽�з���
//         alert(Return.Property);    //��������
//     }
//     return Return;    //���ɹ��о�̬Ԫ��
// })();

cc._RFpop();