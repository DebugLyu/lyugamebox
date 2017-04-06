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
}

module.exports = TuiBingConfig;