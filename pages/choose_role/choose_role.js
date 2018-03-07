var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

//WebIM.conn  实例化的  
Page({
	data: {
		friend_name:''
	},
	onShow: function() {
		//console.log(getCurrentPages())
	},
  impatient: function() {
    wx.redirectTo({
      url: '../login/login?role=patient'
    })
	},
  // 允许从相机和相册扫码
  imdoctor:function(){
    wx.redirectTo({
      url: '../login/login?role=doctor'
    })
  }
})



















