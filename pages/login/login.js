var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default


Page({
    data: {
        // name: 'zzf1',
        // psd: 'z',
        name:'ceshi1', 
        psd:'ceshi1',
        grant_type: "password",
        myrole: 'patient', // 默认患者
        jim: null
    },
    onLoad: function (option) {
      // this.login()       
      // console.log(1);
      // console.log(option.role);
      this.setData({
        myrole: option.role
      })
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
    // onLoad: function (option) {
    //     // this.login()       
    //   console.log(1);
    //   this.setData({
    //     myrole: option.role
    //   })
    //   console.log(myrole);      
    // },
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
            // var options = {
            //     apiUrl: WebIM.config.apiURL,
            //     user: that.data.name,
            //     pwd: that.data.psd,
            //     grant_type: that.data.grant_type,
            //     appKey: WebIM.config.appkey
            // }
            wx.setStorage({
                key: "myUsername",
                data: that.data.name
            })
            //console.log('open')
            // WebIM.conn.open(options)            
            getApp().globalData.jim.login({
              'username': that.data.name,
              'password': that.data.psd
            }).onSuccess(function (data) {
              //data.code 返回码
              //data.message 描述
              if(data.code == 0) {
                wx.redirectTo({
                  // 登录成功，跳转到主页面
                  url: '../main/main?role=' + role + 'myName=' + that.data.name
                })
              }
            }).onFail(function (data) {
              //同上
            })
        }
    }
})




