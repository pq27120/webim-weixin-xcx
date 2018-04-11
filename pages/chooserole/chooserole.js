var uuid = require('../../utils/uuidtool.js')

//WebIM.conn  实例化的  
Page({
  data: {
    friend_name: ''
  },

  onLoad: function (option) {
    this.initUserInfoData();
  },

  initUserInfoData() {
    var that = this;
    wx.getUserInfo({
      success: res => {
        // console.log('>>>>>>>>>' + res.userInfo);
        // 0. 授权获取用户信息
        that.setGlobalData(res);
        that.wechatLogin();
        // this.getWechatInfo();

        // 1. 后台判断获取用户角色（0.新用户；1.为医生; 2.为患者; 3 为医生患者用户)
        that.getUserRole();
      },
      fail: function () {
        console.info("用户拒绝授权");
        wx.showModal({
          title: '用户未授权',
          content: '如需正常使用小程序功能，\n请在微信"发现/小程序"列表中找到并删除本小程序，\n重新打开允许访问用户信息。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户再次授权');
              // that.toAuthorize();
            }
          }
        })
      }
    })
  },

  setGlobalData(res) {
    getApp().globalData.userInfo = res.userInfo;
    getApp().globalData.encryptedData = res.encryptedData;
    getApp().globalData.rawData = res.rawData;
    getApp().globalData.signature = res.signature;
    getApp().globalData.iv = res.iv;

    // 模拟 unionId
    // getApp().globalData.unionId = uuid.uuid().replace(new RegExp("-", "g"), "");
  },

  wechatLogin() {
    wx.login({
      success: function (res) {
        // console.log('wx login res=' + res);
        console.log('wx login res.code=' + res.code)
        if (res.code) {
          wx.request({
            url: getApp().globalData.api.wechatLogin,
            data: {
              "code": res.code
            },
            header: { 'Content-Type': "application/x-www-form-urlencoded" },
            method: 'get',
            success: function (res) {
              // console.log(res);
              // console.log('res.data.sessionKey=' + res.data.data.sessionKey);
              // console.log('res.data.unionid=' + res.data.data.unionid);
              console.log('res.data.openid=' + res.data.data.openid);
              getApp().globalData.sessionKey = res.data.data.sessionKey;
              getApp().globalData.unionid = res.data.data.unionid;
              getApp().globalData.openid = res.data.data.openid;

            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  getWechatInfo() {

    // console.log("wxinfo sessionKey=" + getApp().globalData.sessionKey);
    // console.log("wxinfo signature=" + getApp().globalData.signature);
    // console.log("wxinfo rawData=" + getApp().globalData.rawData);
    // console.log("wxinfo encryptedData=" + getApp().globalData.encryptedData);
    // console.log("wxinfo iv=" + getApp().globalData.iv);

    wx.request({
      url: getApp().globalData.api.wechatInfo,
      data: {
        "sessionKey": getApp().globalData.sessionKey,
        "signature": getApp().globalData.signature,
        "rawData": getApp().globalData.rawData,
        "encryptedData": getApp().globalData.encryptedData,
        "iv": getApp().globalData.iv
      },
      header: { 'Content-Type': "application/x-www-form-urlencoded" },
      method: 'get',
      success: function (res) {
        console.log('res=' + res);
      }
    })
  },

  getUserRole() {
    var that = this
    wx.request({
      url: getApp().globalData.api.roleInfo,
      data: { "wechatId": getApp().globalData.openid },
      header: { 'Content-Type': "application/x-www-form-urlencoded" },
      method: 'post',
      success: function (res) {
        // 0 为未注册用户, 1 为医生, 2 为患者, 3 为医生患者用户
        // console.log('remote role=' + res.data.data);
        getApp().globalData.role = res.data.data;
        // getApp().globalData.role = 1;
        // 2. 新用户，选角色，选择医生完善医生信息；选择患者完善患者信息
        var role = getApp().globalData.role;
        // var autologin = getApp().globalData.autoLogin
        // console.log('getApp().globalData.autoLogin=' + autologin)
        console.log('>>>>>>>>>>>role=' + role);
        if (role != 0) {// 3. 非新用户，直接登录
          that.jimlogin();
        }
        // 0.新用户，停留在此页面选择角色
      }
    })
  },
  // 选择患者角色
  impatient: function () {
    getApp().globalData.role = 2;
    this.register();
  },
  // 选择医生角色
  imdoctor: function () {
    getApp().globalData.role = 1;
    this.register();
  },

  register: function () {
    wx.redirectTo({
      url: '../register/register'
    })
  },

  login: function () {
    wx.redirectTo({
      url: '../login/login'
    })
  },

  main: function () {
    wx.redirectTo({
      url: '../main/main'
    })
  },

  jimlogin: function () {
    var that = this

    var role = getApp().globalData.role;

    // 1 为医生, 2 为患者
    var name = (role == 1) ? ('doc' + getApp().globalData.openid) : ('pat' + getApp().globalData.openid);

    getApp().globalData.jim.login({
      // 'username': getApp().globalData.loginName,
      // 'password': getApp().globalData.loginPassWord
      'username': name,
      'password': name
    }).onSuccess(function (data) {
      
      if (data.code == 0) {
        // that.getUserRole();
        that.main();
      }
    }).onFail(function (data) {
      //同上
      console.log('账号或密码错误，请手工登录')
      that.login();
    })
  }

  // toAuthorize() {
  //   //再授权
  //   wx.openSetting({
  //     success: (res) => {
  //       //因为openSetting会返回用户当前设置，所以通过res.authSetting["scope.userInfo"]来判断用户是否勾选了【用户信息】这一项
  //       if (res.authSetting["scope.userInfo"]) {
  //         var that = this
  //         wx.getUserInfo(function (userInfo) {
  //           //更新数据
  //           // that.setData({
  //             getApp().globalData.userInfo = userInfo;
  //             console.log('>>1=' + getApp().globalData.userInfo);
  //             console.log('>>1=' + getApp().globalData.userInfo.nickName);
  //             // noAuthorized: false
  //           // })
  //         })
  //       } else {
  //         wx.showModal({
  //           title: '用户未授权',
  //           content: '如需正常使用小程序，请点击授权按钮，勾选用户信息并点击确定。',
  //           showCancel: false,
  //           success: function (res) {
  //             if (res.confirm) {
  //               console.log('用户确定授权')
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // }
})



















