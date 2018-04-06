//WebIM.conn  实例化的  
Page({
  data: {
    friend_name: ''
  },

  onLoad: function (option) {
    this.initUserInfoData();
  },

  initUserInfoData() {
    wx.getUserInfo({
      success: res => {
        // console.log('>>>>>>>>>' + res.userInfo);
        // 0. 授权获取用户信息
        this.setGlobalData(res);
        // 1. 后台判断获取用户角色（0.新用户；1.为医生; 2.为患者; 3 为医生患者用户)
        this.getUserRole();
      }
    })
  },

  setGlobalData(res) {
    getApp().globalData.userInfo = res.userInfo;
    // console.log(getApp().globalData.userInfo);
    getApp().globalData.encryptedData = res.encryptedData;
  },

  getUserRole() {
    var that = this
    wx.request({
      url: getApp().globalData.api.roleInfo,
      data: { "wechatId": "unionId" },
      header: { 'Content-Type': "application/x-www-form-urlencoded" },
      method: 'post',
      success: function (res) {
        // 0 为未注册用户, 1 为医生, 2 为患者, 3 为医生患者用户
        // console.log('remote role=' + res.data.data);
        // getApp().globalData.role = res.data.data;
        getApp().globalData.role = 1;
        // 2. 新用户，选角色，选择医生完善医生信息；选择患者完善患者信息
        var role = getApp().globalData.role;
        // var autologin = getApp().globalData.autoLogin
        // console.log('getApp().globalData.autoLogin=' + autologin)
        // console.log('>>>>>>>>>>>role=' + role);
        if (role != 0) {// 3. 非新用户，直接登录
          // if (autologin) {//有账号密码，直接登录
          //   // var that = this;
          //   console.log('autologin')
            that.jimlogin();
          // } else {
            // wx.redirectTo({
            //   url: '../login/login'
            // })
            // var that = this;
            // that.login();
          // }
        }
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
    console.log(getApp().globalData.loginName);
    console.log(getApp().globalData.loginPassWord);
    getApp().globalData.jim.login({
      'username': getApp().globalData.loginName,
      'password': getApp().globalData.loginPassWord
    }).onSuccess(function (data) {
      //data.code 返回码
      //data.message 描述
      // console.log('autologin>>>>>>>>>>>>>>>');
      // getApp().globalData.loginName = that.data.name;
      // getApp().globalData.loginPassWord = that.data.psd;
      if (data.code == 0) {
        // that.getUserRole();
        that.main();
      }
    }).onFail(function (data) {
      //同上
      console.log('账号密码错误，请手工登录')
      that.login();
    })
  }

  // getUserRole: function () {
  //   wx.request({
  //     url: getApp().globalData.api.roleInfo,
  //     data: { "wechatId": "unionId" },
  //     header: { 'Content-Type': "application/x-www-form-urlencoded" },
  //     method: 'post',
  //     success: function (res) {
  //       // 0 为未注册用户, 1 为医生, 2 为患者, 3 为医生患者用户
  //       getApp().globalData.role = 1;
  //       // 2. 新用户，选角色，选择医生完善医生信息；选择患者完善患者信息
  //       var role = getApp().globalData.role;
  //       // console.log('>>>>>>>>>>>role=' + role);
  //       if (role != 0) {// 3. 非新用户，直接登录
  //         wx.redirectTo({
  //           url: '../main/main'
  //         })
  //       }
  //     }
  //   })
  // }
})



















