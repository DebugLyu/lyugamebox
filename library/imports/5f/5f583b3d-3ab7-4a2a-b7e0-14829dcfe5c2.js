"use strict";

var ErrorCode = {};
ErrorCode.ACCOUNT_REPEAT = 1;
ErrorCode.DBSERVICE_ERROR = 99;

ErrorCode.NO_ACCOUNT = 101;
ErrorCode.PASSWORD_ERROR = 102;
ErrorCode.HAS_ONLINE = 103;

ErrorCode.ROOM_NOT_FOUND = 201;
ErrorCode.ROOM_FULL = 202;

ErrorCode.GOLD_NOT_ENOUGH = 301;
ErrorCode.BANKER_NO_BET = 401;
ErrorCode.NOT_BANKER = 402;
ErrorCode.NOT_IN_QUEUE = 403;

var msgcode = {};
msgcode[ErrorCode.ACCOUNT_REPEAT] = "账号重复", msgcode[ErrorCode.DBSERVICE_ERROR] = "数据错误", msgcode[ErrorCode.NO_ACCOUNT] = "账号不存在", msgcode[ErrorCode.PASSWORD_ERROR] = "密码错误", msgcode[ErrorCode.HAS_ONLINE] = "已经在线，请稍后重试", msgcode[ErrorCode.ROOM_NOT_FOUND] = "未找到该房间", msgcode[ErrorCode.ROOM_FULL] = "", msgcode[ErrorCode.GOLD_NOT_ENOUGH] = "金币不足", msgcode[ErrorCode.BANKER_NO_BET] = "庄家不能下注", msgcode[ErrorCode.NOT_BANKER] = "你不是庄家", msgcode[ErrorCode.NOT_IN_QUEUE] = "你不在上庄队列",

// 账号状态
msgcode.ACCOUNT_TOO_LONG = "账号或密码长度错误，请输入6~12位字符", msgcode.PASSWORD_NOT_SAME = "两次输入的密码不相同", msgcode.NETWORK_RELINK = "网络已断开，点击重连", msgcode.NETWORK_RELOGIN = "网络已断开，请重新登录", msgcode.NETWORK_UNCONNECT = "无法连接到服务器", msgcode.NETWORK_OTHER_LOGIN = "账号在其他地方登陆", msgcode.GOLD_NOT_ENOUGH = "金币不足",
//推饼 状态
msgcode.TUIBING_STATE_STOP = "暂无庄家", msgcode.TUIBING_STATE_BEGIN = "正在等待庄家选择", msgcode.TUIBING_STATE_WAITOPEN = "可以下注了", msgcode.TUIBING_STATE_OPENNING = "正在开牌", msgcode.TUIBING_STATE_REWARD = "发送奖励",

//推饼提示
msgcode.TUIBING_SELECT_GOLD = "请先选择金币", msgcode.TUIBING_MORETHAN_BANKER = "已超过押注上限", msgcode.TUIBING_KEEP_BANKER = "是否继续坐庄？", msgcode.TUIBING_BANKER_BEGIN = "要开始游戏么？", module.exports = msgcode;