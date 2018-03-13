var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
	data: {
		username:'',
    isDoctor: false
	},
	onLoad: function(option) {
		var myUsername = wx.getStorageSync('myUsername')
		this.setData({
			username: myUsername,
      isDoctor: option.role == 'doctor'
		})
    var that = this
    console.log('onload.isDoctor=' + that.data.isDoctor)
	},
	tab_contact: function() {
		wx.redirectTo({
			url: '../main/main'
		})
	},
	tab_chat: function() {
		wx.redirectTo({
			url: '../chat/chat'
		})
	},
	person: function() {
		var myUsername = wx.getStorageSync('myUsername')
		wx.navigateTo({
			url: '../friend_info/friend_info?yourname=' + myUsername
		})
	},
  // 医生咨询费设置界面
  setting_money:function(){
    wx.navigateTo({
      url: '../setting_money/setting_money?yourname=' + wx.getStorageSync('myUsername')
    })
  },
	logout: function() {
		wx.showModal({
			title: '是否退出登录',
			success: function(res) {
			    if (res.confirm) {
		   	        WebIM.conn.close()
		   	        //wx.closeSocket()
		   	        wx.redirectTo({
		   	        	// url: '../login/login'
                   url: '../choose_role/choose_role'
		   	        })
				}
			}
		})
	}
})