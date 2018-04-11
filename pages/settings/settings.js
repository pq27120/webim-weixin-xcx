var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
  data: {
    isDoctor: '',
    username: ''
  },
  onLoad: function (option) {
    // var myUsername = wx.getStorageSync('myUsername')
    this.setData({
      // isDoctor: option.role === 'doctor',
      isDoctor: getApp().globalData.role === 1,
      // username: getApp().globalData.name
      username: getApp().globalData.userInfo.nickName
    })
    // var that = this
    // console.log('onload.isDoctor=' + that.data.isDoctor)
  },
  tab_contact: function () {
    wx.redirectTo({
      url: '../main/main'
    })
  },
  tab_chat: function () {
    wx.redirectTo({
      url: '../chat/chat'
    })
  },
  switchChange: function (e) {
    // console.log('switch=', e.detail.value)
    getApp().globalData.autoLogin = e.detail.value;
  },
  person: function () {
    // var myUsername = wx.getStorageSync('myUsername')
    // console.log('myUsername=' + myUsername)
    wx.navigateTo({
      // url: '../friend_info/friend_info?yourname=' + myUsername
      url: '../friend_info/friend_info'
    })
  },
  // 医生咨询费设置界面
  setting_money: function () {
    wx.navigateTo({
      // url: '../setting_money/setting_money?yourname=' + wx.getStorageSync('myUsername')
      url: '../setting_money/setting_money'
    })
  },
  logout: function () {
    wx.showModal({
      title: '是否退出登录',
      success: function (res) {
        if (res.confirm) {
          WebIM.conn.close()
          //wx.closeSocket()
          wx.redirectTo({
            // url: '../login/login'
            // 退到账号切换的界面
            // url: '../chooserole/chooserole'
            url: '../chooseuser/chooseuser'
          })
        }
      }
    })
  }
})