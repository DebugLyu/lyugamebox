var ErrorCode = require("errorcode")

var msgcode = {}
msgcode[ ErrorCode.ACCOUNT_REPEAT ] = "账号重复",
msgcode[ ErrorCode.DBSERVICE_ERROR ] = "数据错误",

msgcode[ ErrorCode.NO_ACCOUNT ] = "账号不存在",
msgcode[ ErrorCode.PASSWORD_ERROR ] = "密码错误",
msgcode[ ErrorCode.HAS_ONLINE ] = "已经在线，请稍后重试",
msgcode[ ErrorCode.ACCOUNT_SEAL ] = "账号被禁用，解禁日期为<br/><color=#FF0000><size = 25>",

msgcode[ ErrorCode.ROOM_NOT_FOUND ] = "未找到该房间",
msgcode[ ErrorCode.ROOM_FULL ] = "房间已满",

msgcode[ ErrorCode.GOLD_NOT_ENOUGH ] = "金币不足",
msgcode[ ErrorCode.BANKER_NO_BET ] = "庄家不能下注",
msgcode[ ErrorCode.NOT_IN_QUEUE ] = "不在上庄队列中",
msgcode[ ErrorCode.NOT_BANKER ] = "你不是庄家",
msgcode[ ErrorCode.UR_BANKER ] = "你已经是庄家",
msgcode[ ErrorCode.HAS_IN_QUEUE ] = "你已经在队列",
msgcode[ ErrorCode.TUIBING_ROOMCLOSE ] = "房间已关闭",

msgcode[ ErrorCode.PERMISSION_DENIED ] = "权限不足",
msgcode[ ErrorCode.LOGTYPE_ERROR ] = "日志类型错误",
msgcode[ ErrorCode.NO_USER_ID ] = "用户ID不存在",
msgcode[ ErrorCode.NOT_ONLINE ] = "用户不在线，无法操作",

// 账号状态
msgcode.ACCOUNT_TOO_LONG = "账号或密码长度错误，请输入6~12位字符",
msgcode.PASSWORD_NOT_SAME = "两次输入的密码不相同",

msgcode.NETWORK_RELINK = "网络已断开，点击重连",
msgcode.NETWORK_RELOGIN ="网络已断开，请重新登录",
msgcode.NETWORK_UNCONNECT = "无法连接到服务器",
msgcode.NETWORK_OTHER_LOGIN = "账号在其他地方登陆",

msgcode.GOLD_NOT_ENOUGH = "金币不足",
//推饼 状态
msgcode.TUIBING_NO_BANKER = "暂无庄家"
msgcode.TUIBING_STATE_STOP = "暂无庄家，等待玩家上庄",
msgcode.TUIBING_STATE_BEGIN = "休息一下，游戏马上开始",
msgcode.TUIBING_STATE_READY = "可以下注了，快投注吧",
msgcode.TUIBING_STATE_WAITOPEN = "下注结束 等待开牌",
msgcode.TUIBING_STATE_OPENNING = "正在开牌",
msgcode.TUIBING_STATE_REWARD = "发送奖励",

//推饼提示
msgcode.TUIBING_SELECT_GOLD = "请先选择金币",
msgcode.TUIBING_MORETHAN_BANKER = "已超过押注上限",
msgcode.TUIBING_GOLD_NOT_ENOUGH = "金币不足以快速上庄",
msgcode.TUIBING_GOLD_BANKER_LESS = "金币低于最低上庄需求",
msgcode.TUIBING_GOLD_BANKER_NOT_ENOUGH = "金币不足",

msgcode.TUIBING_KEEP_BANKER = "是否继续坐庄？",
msgcode.TUIBING_BANKER_BEGIN = "要开始游戏么？",
msgcode.TUIBING_BANKER_TYPE = "<color=#FFFFFF>要快速上庄么？</c><br/><color=#FFAD00><size = 20>（快速上庄需要20万金币）</color></size>",
msgcode.TUIBING_ASK_UNBANKER = "确认下庄么？<br/><color=#FF0000><size = 25>下庄后需要重新排队上庄</color></size>",

msgcode.GM_CALL_GM = "请联系GM",
msgcode.GM_PAYMENT_OK = "充值成功",

msgcode.COMMON_ERROR_ID = "请输入正确的玩家id",
msgcode.COMMON_ERROR_GOLD = "请输入正确的金币数",
msgcode.COMMON_ERROR_USER = "无法查询到该玩家",

msgcode.TRANSTFER_SUBMIT_1 = "收款人:<color=#FF0000>",
msgcode.TRANSTFER_SUBMIT_2 = "</color><br/>收款金额:<color=#FF0000>",
msgcode.TRANSTFER_SUBMIT_3 = "</color><size = 29><br/><br/><color=#FFFFFF>确认转账么？</size></color>",
msgcode.TRANSTFER_NOTICE_1 = "收到来自<color=#00FF00>",
msgcode.TRANSTFER_NOTICE_2 = "</color>的<color=#FF0000>",
msgcode.TRANSTFER_NOTICE_3 = "金币</color>",
msgcode.TRANSTFER_COMPLETE = "交易完成",


msgcode.END_COLOR = "</color>",
msgcode.END_SIZE = "</size>",

module.exports = msgcode;