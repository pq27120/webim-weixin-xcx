var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
  data: {
    // name: 'zzf1',
    // psd: 'z',
    name: '',//ceshi1
    psd: '',//ceshi1
    grant_type: "password",
    jim: null
  },
  bindUsername: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPassword: function (e) {
    this.setData({
      psd: e.detail.value
    })
  },
  login: function () {
    //console.log('login')
    var that = this
    // var resp = RL_YTX.init("123456"); 
    if (that.data.name == '') {
      wx.showModal({
        title: '请输入账号！',
        confirmText: 'OK',
        showCancel: false
      })
    } else if (that.data.psd == '') {
      wx.showModal({
        title: '请输入密码！',
        confirmText: 'OK',
        showCancel: false
      })
    } else {

      getApp().globalData.jim.login({
        'username': that.data.name,
        'password': that.data.psd
      }).onSuccess(function (data) {
        //data.code 返回码
        //data.message 描述
        // console.log(that.data.myrole);
        getApp().globalData.loginName = that.data.name;
        getApp().globalData.loginPassWord = that.data.psd;
        // console.log('login autologin>>>>>>>>>>>>>>>' + getApp().globalData.autoLogin);
        // console.log('login.name>>>' + getApp().globalData.loginName);
        // console.log('login.password>>>' + getApp().globalData.loginPassWord);
        // if (getApp().globalData.autoLogin) { // 自动登录打开
        //   wx.setStorage({
        //     key: 'username',
        //     data: that.data.name
        //   })

        //   wx.setStorage({
        //     key: 'password',
        //     data: that.data.name
        //   })
        // }

        // wx.getStorage({
        //   key: 'userName',
        //   success: function (res) {
        //     console.log('>>>>' + res.data)
        //   }
        // })

        if (data.code == 0) {
          that.getUserRole();
        }
      }).onFail(function (data) {
        //同上
      })
    }
  },

  getUserRole: function () {
    wx.request({
      url: getApp().globalData.api.roleInfo,
      data: { "wechatId": getApp().globalData.openid },
      header: { 'Content-Type': "application/x-www-form-urlencoded" },
      method: 'post',
      success: function (res) {
        // 0 为未注册用户, 1 为医生, 2 为患者, 3 为医生患者用户
        // getApp().globalData.role = 1;
        // 2. 新用户，选角色，选择医生完善医生信息；选择患者完善患者信息
        var role = getApp().globalData.role;
        // console.log('>>>>>>>>>>>role=' + role);
        // if (role != 0) {// 3. 非新用户，直接登录
        wx.redirectTo({
          url: '../main/main'
        })
        // }
      }
    })
  }
})




