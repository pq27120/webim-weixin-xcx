//index.js
//获取应用实例
var app = getApp()
Page({
  timeOut: null,
  data: {
    // motto: '环信即时通讯云',
    motto:'结核医生',
    userInfo: {},
    // role: '',
    login: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.redirectTo({
      url: '../login/login'
      // url: '../choose_role/choose_role'
    })
    clearTimeout(this.timeOut)  
  },
  onLoad: function () {
    
    var that = this
    // console.log('>>>>'+ that.data.role)
    this.timeOut = setTimeout(function() {
           wx.redirectTo({
              url: '../login/login'
              // url: '../choose_role/choose_role'
          })
    },3000)
    
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
