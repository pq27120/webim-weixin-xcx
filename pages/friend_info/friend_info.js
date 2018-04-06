Page({
	data: {
		yourname: '',
    yourheadimg: ''
	},
	onLoad: function(option) {
		// console.log(option)
		this.setData({
			// yourname: option.yourname
      // yourname: getApp().globalData.name
      yourname: getApp().globalData.userInfo.nickName,
      yourheadimg: getApp().globalData.userInfo.avatarUrl
		})
	}
})