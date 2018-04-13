//WebIM.conn  实例化的  
Page({
  data: {
    friend_name: ''
  },
  bindFriendName: function (e) {
    this.setData({
      friend_name: e.detail.value
    })
  },
  // 允许从相机和相册扫码
  scanfriend() {
    console.log('scan')
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      },
      fali: (res) => {
        console.log('失败=' + res);
      }
    })
  },
  addfriend() {
    var that = this
    if (that.data.friend_name == '') {
      wx.showToast({
        title: '请输入好友账号！',
        duration: 1500
      })
      return
    }
    if (that.data.friend_name == getApp().globalData.name) {
      wx.showToast({
        title: '您不能添加自己为好友!',
        duration: 1500
      })
      return
    } else {

      var friendnames = [];
      friendnames.push(that.data.friend_name);
      console.log('>>>>>>>>>>>>>>' + friendnames);

      // 好友添加接口调用
      wx.request({
        url: getApp().globalData.api.addFriend + that.data.friend_name,
        data: friendnames,
        header: { 'Content-Type': "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
          // console.log('>>>> requst fk doctor:' + res.data.msg);
          // 0 为未注册用户, 1 为医生, 2 为患者, 3 为医生患者用户
          // getApp().globalData.role = (res.data.data === 1) ? 'doctor' : 'patient'
          wx.showToast({
            title: '添加好友成功',
            duration: 1500,
            success: function () {
              // console.log('haha');
              setTimeout(function () {
                //要延时执行的代码
                wx.redirectTo({
                  url: '../main/main'
                })
              }, 1500) //延迟时间
            }
          })
          // console.log('>>>>' + that.data.friend_name)
        }
      })

    }
  }
})



















