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
    // wx.redirectTo({
    //   url: '../login/login?role=patient'
    // })
    this.gotoLogin('patient');
	},
  // 医生角色
  imdoctor:function(){
    // wx.redirectTo({
    //   url: '../login/login?role=doctor'
    // })
    this.gotoLogin('doctor');
  },

  // 跳转登录界面，带入角色参数
  gotoLogin:function(role){
    wx.redirectTo({
      url: '../login/login?role=' + role
    })
  }
})



















