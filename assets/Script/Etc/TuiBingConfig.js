var TuiBingConfig = {
	State:{
		Stop : 0, // 未初始化
		Begin : 1, // 新游戏开始
		Begin_Check_Begin : 2, // 询问是否开始游戏
		Begin_Check_Keep : 3, // 询问是否续庄
		Ready : 4, // 准备好可以押注
		WaitOpen : 5, // 等待开牌
		Openning : 6, // 开牌阶段
		Reward : 7, // 发放奖励
	},
	Time : {
		// WAIT_BEGIN = 5, -- 等待开始游戏时间
		// WAIT_KEEP = 15, -- 等待续庄时间
		// WAIT_BET = 10, -- 等待押注时间
		// WAIT_OPEN = 10, -- 开牌展示时间
		// WAIT_REWARD = 2, -- 奖励发送时间
		Begin : 5,
		Begin_keep : 30,
		Bet : 15,
		Wait : 3,
		Open : 10,
		Reward : 8,
	},

	LessGold : 10000, //最低金币
	BankerLessGold : 200000, // 上庄最低金币
	FastBankerGold : 200000, // 快速上庄缴纳金
}

module.exports = TuiBingConfig;